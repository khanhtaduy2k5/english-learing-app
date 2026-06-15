package com.example.english_learning_app.writing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqService {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final WritingFeedbackLogRepository logRepository;
    private final StringRedisTemplate redisTemplate;

    private static final RedisScript<Long> RATE_LIMIT_SCRIPT = new DefaultRedisScript<>(
        "local current = redis.call('INCR', KEYS[1]); " +
        "if current == 1 then " +
        "  redis.call('EXPIRE', KEYS[1], ARGV[1]); " +
        "end; " +
        "return current;",
        Long.class
    );

    @Transactional
    public WritingFeedbackResponse analyzeWriting(WritingFeedbackRequest request) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Groq API key is not configured");
        }

        // Bước 1: Cắt tỉa (Sanitization) - Giới hạn 1000 từ & Validate Request
        if (request == null || request.getText() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Text is required");
        }
        String text = request.getText().trim();
        String[] words = text.split("\\s+");
        if (words.length > 1000) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Text must not exceed 1000 words"
            );
        }

        // Bước 2: Phát hiện Prompt Injection
        String lowerText = text.toLowerCase();
        if (lowerText.contains("ignore previous instructions") ||
            lowerText.contains("ignore the instructions above") ||
            lowerText.contains("</user_text>")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Prompt injection detected. Request rejected."
            );
        }

        // Bước 3: Xác thực & Rate Limiting (Redis)
        String userId = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "anonymous";

        String redisKey = "rate_limit:writing:" + userId;
        boolean bypassRateLimit = false;
        if (redisTemplate == null) {
            log.warn("StringRedisTemplate is not configured, bypassing AI rate limit checks.");
            bypassRateLimit = true;
        }

        if (!bypassRateLimit) {
            try {
                Long currentVal = redisTemplate.execute(
                    RATE_LIMIT_SCRIPT,
                    java.util.Collections.singletonList(redisKey),
                    "3600"
                );

                if (currentVal == null) {
                    log.warn("Redis rate limiter returned null count for user: {}, bypassing checks.", userId);
                } else if (currentVal > 5) {
                    throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Rate limit exceeded. Maximum 5 requests per hour."
                    );
                }
            } catch (ResponseStatusException e) {
                throw e;
            } catch (Exception e) {
                log.warn("Rate limit service unavailable, allowing request for user: {}. Error: {}", userId, e.getMessage());
            }
        }

        // Bước 4: Chuẩn bị Prompt & Gọi Groq API
        String systemPrompt = buildSystemPrompt(request.getTaskType(), request.getTargetLevel());
        String userContent = "Please analyze this English writing inside the <user_text> tag:\n\n<user_text>" + text + "</user_text>";

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userContent)
        ));
        body.put("temperature", 0.3);
        body.put("response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isMissingNode() || !choices.isArray() || choices.isEmpty()) {
                log.error("Invalid response from Groq API (no choices): {}", response.getBody());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Invalid response from AI service");
            }
            JsonNode message = choices.get(0).path("message");
            if (message.isMissingNode()) {
                log.error("Invalid response from Groq API (no message): {}", response.getBody());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Invalid response from AI service");
            }
            String content = message.path("content").asText();
            WritingFeedbackResponse feedbackResponse = parseGroqResponse(content);

            // Bước 5: Trích xuất Token Usage
            JsonNode usageNode = root.path("usage");
            int promptTokens = usageNode.path("prompt_tokens").asInt(0);
            int completionTokens = usageNode.path("completion_tokens").asInt(0);
            int totalTokens = usageNode.path("total_tokens").asInt(0);

            // Bước 6: Lưu Nhật ký giao dịch xuống Database
            WritingFeedbackLog feedbackLog = WritingFeedbackLog.builder()
                .userId(userId)
                .inputText(text)
                .overallScore(feedbackResponse.getOverallScore())
                .band(feedbackResponse.getBand())
                .summary(feedbackResponse.getSummary())
                .feedbackJson(content)
                .promptTokens(promptTokens)
                .completionTokens(completionTokens)
                .totalTokens(totalTokens)
                .build();
            logRepository.save(feedbackLog);

            return feedbackResponse;

        } catch (ResponseStatusException e) {
            throw e;
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("Groq API returned HTTP error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Upstream AI service error: " + e.getMessage(), e);
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("Groq API timeout/connection failure: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI service is currently unavailable", e);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.error("Failed to parse Groq API JSON: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Invalid JSON response from AI service", e);
        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to analyze writing: " + e.getMessage(), e);
        }
      }

    private String buildSystemPrompt(String taskType, String targetLevel) {
        return """
            You are an expert English writing coach. Analyze the provided text and return a JSON object \
            with this exact structure — no extra keys, no markdown, pure JSON:
            {
              "overallScore": <integer 0-100>,
              "band": "<CEFR level e.g. B2 or C1>",
              "summary": "<2-3 sentence overall assessment>",
              "grammarErrors": [
                {"original": "...", "suggestion": "...", "explanation": "...", "severity": "error|warning|info"}
              ],
              "vocabularySuggestions": [
                {"original": "...", "suggestion": "...", "explanation": "...", "severity": "info"}
              ],
              "coherencePoints": [
                {"original": "...", "suggestion": "...", "explanation": "...", "severity": "warning|info"}
              ],
              "strengths": ["...", "..."],
              "improvements": ["...", "..."],
              "correctedText": "<full corrected version of the input text>"
            }
            Task type: %s. Target CEFR level: %s.
            Be specific, constructive, and educational. Return valid JSON only.
            """.formatted(taskType, targetLevel);
    }

    private WritingFeedbackResponse parseGroqResponse(String json) throws Exception {
        JsonNode node = objectMapper.readTree(json);

        return WritingFeedbackResponse.builder()
            .overallScore(node.path("overallScore").asInt(70))
            .band(node.path("band").asText("B2"))
            .summary(node.path("summary").asText(""))
            .grammarErrors(parseFeedbackItems(node.path("grammarErrors")))
            .vocabularySuggestions(parseFeedbackItems(node.path("vocabularySuggestions")))
            .coherencePoints(parseFeedbackItems(node.path("coherencePoints")))
            .strengths(parseStringList(node.path("strengths")))
            .improvements(parseStringList(node.path("improvements")))
            .correctedText(node.path("correctedText").asText(""))
            .build();
    }

    private List<WritingFeedbackResponse.FeedbackItem> parseFeedbackItems(JsonNode arr) {
        List<WritingFeedbackResponse.FeedbackItem> items = new ArrayList<>();
        if (arr != null && arr.isArray()) {
            arr.forEach(n -> items.add(WritingFeedbackResponse.FeedbackItem.builder()
                .original(n.path("original").asText(""))
                .suggestion(n.path("suggestion").asText(""))
                .explanation(n.path("explanation").asText(""))
                .severity(n.path("severity").asText("info"))
                .build()));
        }
        return items;
    }

    private List<String> parseStringList(JsonNode arr) {
        List<String> list = new ArrayList<>();
        if (arr != null && arr.isArray()) {
            arr.forEach(n -> list.add(n.asText()));
        }
        return list;
    }
}
