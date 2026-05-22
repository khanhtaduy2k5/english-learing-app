package com.example.english_learning_app.writing;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

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

    public WritingFeedbackResponse analyzeWriting(WritingFeedbackRequest request) {
        String systemPrompt = buildSystemPrompt(request.getTaskType(), request.getTargetLevel());

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", "Please analyze this English writing:\n\n" + request.getText())
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
            String content = root.path("choices").get(0).path("message").path("content").asText();
            return parseGroqResponse(content);

        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to analyze writing: " + e.getMessage());
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
