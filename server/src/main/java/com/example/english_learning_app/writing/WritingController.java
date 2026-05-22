package com.example.english_learning_app.writing;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/writing")
@RequiredArgsConstructor
public class WritingController {

    private final GroqService groqService;

    /**
     * POST /api/writing/feedback
     * Requires: Bearer JWT token (Spring Security anyRequest().authenticated())
     */
    @PostMapping("/feedback")
    public ResponseEntity<WritingFeedbackResponse> getFeedback(
        @Valid @RequestBody WritingFeedbackRequest request
    ) {
        WritingFeedbackResponse response = groqService.analyzeWriting(request);
        return ResponseEntity.ok(response);
    }
}
