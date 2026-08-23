package com.example.english_learning_app.writing;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.example.english_learning_app.common.exception.AiRateLimitExceededException;
import com.example.english_learning_app.common.exception.AiServiceException;
import com.example.english_learning_app.common.exception.AiServiceUnavailableException;
import com.example.english_learning_app.common.exception.DomainException;
import com.example.english_learning_app.common.exception.InvalidWritingInputException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqService {

    private static final int MAX_INPUT_WORDS = 1000;
    private static final int MAX_REQUESTS_PER_WINDOW = 5;
    private static final String RATE_LIMIT_WINDOW_SECONDS = "3600";
    private static final String RATE_LIMIT_KEY_PREFIX = "rate_limit:writing:";
    private static final double GROQ_TEMPERATURE = 0.3;
    private static final int DEFAULT_OVERALL_SCORE = 70;
    private static final String DEFAULT_BAND = "B2";
    private static final String DEFAULT_SEVERITY = "info";
    private static final String MODEL_FIELD = "model";

    private static final String JSON_FENCE_PREFIX = "```json";
    private static final String CODE_FENCE_PREFIX = "```";

    private static final List<String> INJECTION_MARKERS = List.of(
        "ignore previous instructions",
        "ignore the instructions above",
        "</user_text>"
    );

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    @Value("${groq.fallbackModel:llama-3.1-8b-instant}")
    private String fallbackModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final WritingFeedbackLogRepository feedbackLogRepository;
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
        validateApiKey();
        String text = sanitizeText(request);
        String userId = resolveUserId();
        enforceRateLimit(userId);

        try {
            return gradeWritingAndRecord(text, request, userId);
        } catch (DomainException e) {
            throw e;
        } catch (HttpStatusCodeException e) {
            log.error("Groq API HTTP error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new AiServiceException("Upstream AI service error: " + e.getMessage(), HttpStatus.BAD_GATEWAY, e);
        } catch (ResourceAccessException e) {
            log.error("Groq API connection failure: {}", e.getMessage(), e);
            throw new AiServiceUnavailableException("AI service is currently unavailable", e);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse Groq API JSON: {}", e.getMessage(), e);
            throw new AiServiceException("Invalid JSON response from AI service", HttpStatus.BAD_GATEWAY, e);
        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage(), e);
            throw new AiServiceException("Failed to analyze writing: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, e);
        }
    }

    private WritingFeedbackResponse gradeWritingAndRecord(String text, WritingFeedbackRequest request, String userId)
            throws JsonProcessingException {
        JsonNode groqResponse = requestFeedbackFromGroq(text, request.getTaskType(), request.getTargetLevel());
        String feedbackJson = extractFeedbackJson(groqResponse);
        WritingFeedbackResponse feedback = parseGroqResponse(feedbackJson);
        recordAuditLog(userId, text, feedbackJson, groqResponse.path("usage"), feedback);
        return feedback;
    }

    private JsonNode requestFeedbackFromGroq(String text, String taskType, String targetLevel)
            throws JsonProcessingException {
        String systemPrompt = buildSystemPrompt(taskType, targetLevel);
        Map<String, Object> requestBody = buildChatRequestBody(systemPrompt, text);
        ResponseEntity<String> response = executeGroqApiCall(requestBody, buildHttpHeaders());
        return objectMapper.readTree(response.getBody());
    }

    private void validateApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new AiServiceUnavailableException("Groq API key is not configured");
        }
    }

    private String sanitizeText(WritingFeedbackRequest request) {
        if (request == null || request.getText() == null) {
            throw new InvalidWritingInputException("Text is required");
        }
        String text = request.getText().trim();

        int wordCount = text.split("\\s+").length;
        if (wordCount > MAX_INPUT_WORDS) {
            throw new InvalidWritingInputException("Text must not exceed %d words".formatted(MAX_INPUT_WORDS));
        }

        if (containsInjectionMarker(text)) {
            throw new InvalidWritingInputException("Prompt injection detected. Request rejected.");
        }
        return text;
    }

    private boolean containsInjectionMarker(String text) {
        String lowerText = text.toLowerCase();
        return INJECTION_MARKERS.stream().anyMatch(lowerText::contains);
    }

    private String resolveUserId() {
        return SecurityContextHolder.getContext().getAuthentication() != null
            ? SecurityContextHolder.getContext().getAuthentication().getName()
            : "anonymous";
    }

    private void enforceRateLimit(String userId) {
        try {
            String redisKey = RATE_LIMIT_KEY_PREFIX + userId;
            Long requestCount = redisTemplate.execute(RATE_LIMIT_SCRIPT, List.of(redisKey), RATE_LIMIT_WINDOW_SECONDS);

            if (requestCount != null && requestCount > MAX_REQUESTS_PER_WINDOW) {
                throw new AiRateLimitExceededException(
                    "Rate limit exceeded. Maximum %d requests per hour.".formatted(MAX_REQUESTS_PER_WINDOW));
            }
        } catch (DomainException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Rate limit service unavailable, allowing request for user: {}. Error: {}", userId, e.getMessage());
        }
    }

    private Map<String, Object> buildChatRequestBody(String systemPrompt, String userContent) {
        Map<String, Object> body = new HashMap<>();
        body.put(MODEL_FIELD, model);
        body.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userContent)
        ));
        body.put("temperature", GROQ_TEMPERATURE);
        body.put("response_format", Map.of("type", "json_object"));
        return body;
    }

    private HttpHeaders buildHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private ResponseEntity<String> executeGroqApiCall(Map<String, Object> body, HttpHeaders headers) {
        try {
            return postToGroq(body, headers);
        } catch (HttpStatusCodeException e) {
            String activeModel = (String) body.get(MODEL_FIELD);
            if (!canFallBackToAlternativeModel(activeModel)) {
                throw e;
            }
            log.warn("Groq API call with model '{}' failed (HTTP {}). Retrying with fallback model '{}'.",
                activeModel, e.getStatusCode(), fallbackModel);
            body.put(MODEL_FIELD, fallbackModel);
            return postToGroq(body, headers);
        }
    }

    private boolean canFallBackToAlternativeModel(String activeModel) {
        return fallbackModel != null && !fallbackModel.isBlank() && !fallbackModel.equalsIgnoreCase(activeModel);
    }

    private ResponseEntity<String> postToGroq(Map<String, Object> body, HttpHeaders headers) {
        return restTemplate.exchange(apiUrl, HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    }

    private String extractFeedbackJson(JsonNode groqResponse) {
        JsonNode message = groqResponse.path("choices").path(0).path("message");
        if (message.isMissingNode()) {
            log.error("Invalid response from Groq API (missing choices/message): {}", groqResponse);
            throw new AiServiceException("Invalid response from AI service", HttpStatus.BAD_GATEWAY);
        }
        return stripMarkdownJsonWrapper(message.path("content").asText());
    }

    private void recordAuditLog(String userId, String inputText, String feedbackJson, JsonNode usage,
            WritingFeedbackResponse feedback) {
        feedbackLogRepository.save(WritingFeedbackLog.builder()
            .userId(userId)
            .inputText(inputText)
            .overallScore(feedback.getOverallScore())
            .band(feedback.getBand())
            .summary(feedback.getSummary())
            .feedbackJson(feedbackJson)
            .promptTokens(usage.path("prompt_tokens").asInt(0))
            .completionTokens(usage.path("completion_tokens").asInt(0))
            .totalTokens(usage.path("total_tokens").asInt(0))
            .build());
    }

    private String stripMarkdownJsonWrapper(String content) {
        if (content == null) {
            return "";
        }
        String trimmed = content.trim();
        if (trimmed.startsWith(JSON_FENCE_PREFIX)) {
            trimmed = trimmed.substring(JSON_FENCE_PREFIX.length());
        } else if (trimmed.startsWith(CODE_FENCE_PREFIX)) {
            trimmed = trimmed.substring(CODE_FENCE_PREFIX.length());
        }
        if (trimmed.endsWith(CODE_FENCE_PREFIX)) {
            trimmed = trimmed.substring(0, trimmed.length() - CODE_FENCE_PREFIX.length());
        }
        return trimmed.trim();
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

    private WritingFeedbackResponse parseGroqResponse(String json) throws JsonProcessingException {
        JsonNode node = objectMapper.readTree(json);

        return WritingFeedbackResponse.builder()
            .overallScore(node.path("overallScore").asInt(DEFAULT_OVERALL_SCORE))
            .band(node.path("band").asText(DEFAULT_BAND))
            .summary(node.path("summary").asText(""))
            .grammarErrors(parseFeedbackItems(node.path("grammarErrors")))
            .vocabularySuggestions(parseFeedbackItems(node.path("vocabularySuggestions")))
            .coherencePoints(parseFeedbackItems(node.path("coherencePoints")))
            .strengths(parseStringList(node.path("strengths")))
            .improvements(parseStringList(node.path("improvements")))
            .correctedText(node.path("correctedText").asText(""))
            .build();
    }

    private List<WritingFeedbackResponse.FeedbackItem> parseFeedbackItems(JsonNode itemsNode) {
        List<WritingFeedbackResponse.FeedbackItem> items = new ArrayList<>();
        if (itemsNode != null && itemsNode.isArray()) {
            itemsNode.forEach(item -> items.add(WritingFeedbackResponse.FeedbackItem.builder()
                .original(item.path("original").asText(""))
                .suggestion(item.path("suggestion").asText(""))
                .explanation(item.path("explanation").asText(""))
                .severity(item.path("severity").asText(DEFAULT_SEVERITY))
                .build()));
        }
        return items;
    }

    private List<String> parseStringList(JsonNode arrayNode) {
        List<String> values = new ArrayList<>();
        if (arrayNode != null && arrayNode.isArray()) {
            arrayNode.forEach(value -> values.add(value.asText()));
        }
        return values;
    }
}
