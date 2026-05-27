package com.example.english_learning_app.writing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

class WritingControllerTest {

    private GroqService groqService;
    private WritingController writingController;

    @BeforeEach
    void setUp() {
        groqService = mock(GroqService.class);
        writingController = new WritingController(groqService);
    }

    @Test
    void getFeedbackReturnsGroqAnalysis() {
        WritingFeedbackRequest request = new WritingFeedbackRequest();
        request.setText("I have studied English for two years.");
        WritingFeedbackResponse expected = WritingFeedbackResponse.builder()
            .overallScore(88)
            .band("B2")
            .summary("Clear writing.")
            .grammarErrors(List.of())
            .vocabularySuggestions(List.of())
            .coherencePoints(List.of())
            .strengths(List.of("Good structure"))
            .improvements(List.of("Use more precise vocabulary"))
            .correctedText("I have studied English for two years.")
            .build();
        when(groqService.analyzeWriting(request)).thenReturn(expected);

        ResponseEntity<WritingFeedbackResponse> response = writingController.getFeedback(request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(88, response.getBody().getOverallScore());
        verify(groqService).analyzeWriting(request);
    }
}
