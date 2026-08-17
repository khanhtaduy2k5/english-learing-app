package com.example.english_learning_app.writing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.english_learning_app.common.exception.AiServiceException;
import com.example.english_learning_app.common.exception.DomainException;
import com.fasterxml.jackson.databind.ObjectMapper;

class GroqServiceTest {

    private RestTemplate restTemplate;
    private GroqService groqService;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        restTemplate = mock(RestTemplate.class);
        var logRepository = mock(WritingFeedbackLogRepository.class);
        var redisTemplate = mock(StringRedisTemplate.class);
        when(redisTemplate.execute(
            any(RedisScript.class),
            any(java.util.List.class),
            anyString()
        )).thenReturn(1L);

        // Mock Security Context
        var securityContext = mock(SecurityContext.class);
        var authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("mock-user");
        SecurityContextHolder.setContext(securityContext);

        groqService = new GroqService(restTemplate, new ObjectMapper(), logRepository, redisTemplate);
        ReflectionTestUtils.setField(groqService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(groqService, "apiUrl", "https://example.test/chat");
        ReflectionTestUtils.setField(groqService, "model", "llama-3.3-70b-versatile");
        ReflectionTestUtils.setField(groqService, "fallbackModel", "llama-3.1-8b-instant");
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
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

        when(restTemplate.exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(ResponseEntity.ok(groqResponse));

        WritingFeedbackResponse response = groqService.analyzeWriting(request);

        assertEquals(91, response.getOverallScore());
        assertEquals("B2", response.getBand());
        assertEquals("I has", response.getGrammarErrors().get(0).getOriginal());
    }

    @Test
    void analyzeWritingSendsBearerTokenAndSelectedModel() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("This is long enough to analyze.");

        when(restTemplate.exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(ResponseEntity.ok("""
            {"choices":[{"message":{"content":"{\\"overallScore\\":70,\\"band\\":\\"B1\\"}"}}]}
            """));

        groqService.analyzeWriting(request);

        ArgumentCaptor<HttpEntity> entityCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            entityCaptor.capture(),
            eq(String.class)
        );

        HttpEntity<?> entity = entityCaptor.getValue();
        assertEquals("Bearer test-api-key", entity.getHeaders().getFirst("Authorization"));
        assertEquals("application/json", entity.getHeaders().getContentType().toString());
        assertEquals("llama-3.3-70b-versatile", ((java.util.Map<?, ?>) entity.getBody()).get("model"));
    }

    @Test
    void analyzeWritingRetriesWithFallbackModelWhenPrimaryFails() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("This is long enough to analyze.");

        String validResponse = """
            {"choices":[{"message":{"content":"{\\"overallScore\\":75,\\"band\\":\\"B2\\"}"}}]}
            """;

        // First call fails with 400 Bad Request (model decommissioned), second call succeeds with fallback model
        when(restTemplate.exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)
        ))
        .thenThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Model decommissioned"))
        .thenReturn(ResponseEntity.ok(validResponse));

        WritingFeedbackResponse response = groqService.analyzeWriting(request);

        assertEquals(75, response.getOverallScore());
        verify(restTemplate, times(2)).exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)
        );
    }

    @Test
    void analyzeWritingWrapsApiAndParsingFailures() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("This is long enough to analyze.");
        when(restTemplate.exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)
        )).thenThrow(new RuntimeException("service unavailable"));

        DomainException exception = assertThrows(
            DomainException.class,
            () -> groqService.analyzeWriting(request)
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
        assertEquals("Failed to analyze writing: service unavailable", exception.getMessage());
    }

    @Test
    void analyzeWritingThrowsBadGatewayOnEmptyChoices() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("This is long enough to analyze.");
        
        String emptyChoicesResponse = "{\"choices\": []}";
        when(restTemplate.exchange(
            eq("https://example.test/chat"),
            eq(HttpMethod.POST),
            any(HttpEntity.class),
            eq(String.class)
        )).thenReturn(ResponseEntity.ok(emptyChoicesResponse));

        DomainException exception = assertThrows(
            DomainException.class,
            () -> groqService.analyzeWriting(request)
        );

        assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatus());
        assertEquals("Invalid response from AI service", exception.getMessage());
    }
}
