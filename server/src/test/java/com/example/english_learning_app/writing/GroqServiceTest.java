package com.example.english_learning_app.writing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

class GroqServiceTest {

    private RestTemplate restTemplate;
    private GroqService groqService;

    @BeforeEach
    void setUp() {
        restTemplate = mock(RestTemplate.class);
        groqService = new GroqService(restTemplate, new ObjectMapper());
        ReflectionTestUtils.setField(groqService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(groqService, "apiUrl", "https://example.test/chat");
        ReflectionTestUtils.setField(groqService, "model", "test-model");
    }

    @Test
    void analyzeWritingBuildsRequestAndParsesJsonFeedback() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("I have learned English for two years.");
        request.setTaskType("essay");
        request.setTargetLevel("B2");

        String groqResponse = """
            {
              "choices": [
                {
                  "message": {
                    "content": "{\\"overallScore\\":91,\\"band\\":\\"B2\\",\\"summary\\":\\"Strong answer.\\",\\"grammarErrors\\":[{\\"original\\":\\"I has\\",\\"suggestion\\":\\"I have\\",\\"explanation\\":\\"Use have with I.\\",\\"severity\\":\\"error\\"}],\\"vocabularySuggestions\\":[],\\"coherencePoints\\":[],\\"strengths\\":[\\"Clear structure\\"],\\"improvements\\":[\\"Add examples\\"],\\"correctedText\\":\\"I have learned English for two years.\\"}"
                  }
                }
              ]
            }
            """;
        when(restTemplate.exchange(eq("https://example.test/chat"), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
            .thenReturn(ResponseEntity.ok(groqResponse));

        WritingFeedbackResponse response = groqService.analyzeWriting(request);

        assertEquals(91, response.getOverallScore());
        assertEquals("B2", response.getBand());
        assertEquals("I has", response.getGrammarErrors().get(0).getOriginal());
    }

    @Test
    void analyzeWritingSendsBearerTokenAndSelectedModel() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("This is long enough to analyze.");

        when(restTemplate.exchange(eq("https://example.test/chat"), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
            .thenReturn(ResponseEntity.ok("""
                {"choices":[{"message":{"content":"{\\"overallScore\\":70,\\"band\\":\\"B1\\"}"}}]}
                """));

        groqService.analyzeWriting(request);

        ArgumentCaptor<HttpEntity> entityCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        org.mockito.Mockito.verify(restTemplate).exchange(eq("https://example.test/chat"), eq(HttpMethod.POST), entityCaptor.capture(), eq(String.class));

        HttpEntity entity = entityCaptor.getValue();
        assertEquals("Bearer test-api-key", entity.getHeaders().getFirst("Authorization"));
        assertEquals("application/json", entity.getHeaders().getContentType().toString());
        assertEquals("test-model", ((java.util.Map<?, ?>) entity.getBody()).get("model"));
    }

    @Test
    void analyzeWritingWrapsApiAndParsingFailures() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("This is long enough to analyze.");
        when(restTemplate.exchange(eq("https://example.test/chat"), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
            .thenThrow(new RuntimeException("service unavailable"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> groqService.analyzeWriting(request));

        assertEquals("Failed to analyze writing: service unavailable", exception.getMessage());
    }
}
