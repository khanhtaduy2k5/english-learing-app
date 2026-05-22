package com.example.english_learning_app.writing;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WritingFeedbackRequest {

    @NotBlank(message = "Text must not be blank")
    @Size(min = 10, max = 5000, message = "Text must be between 10 and 5000 characters")
    private String text;

    /**
     * Task type: "essay" | "email" | "ielts" | "grammar" | "creative"
     */
    private String taskType = "essay";

    /**
     * CEFR target level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
     */
    private String targetLevel = "B2";
}
