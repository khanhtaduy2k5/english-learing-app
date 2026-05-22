package com.example.english_learning_app.writing;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WritingFeedbackResponse {

    /** Numeric score 0–100 */
    private int overallScore;

    /** CEFR band or IELTS score, e.g. "B2" or "7.0" */
    private String band;

    /** 2–3 sentence overall assessment */
    private String summary;

    private List<FeedbackItem> grammarErrors;
    private List<FeedbackItem> vocabularySuggestions;
    private List<FeedbackItem> coherencePoints;

    private List<String> strengths;
    private List<String> improvements;

    /** Full corrected version of the submitted text */
    private String correctedText;

    @Data
    @Builder
    public static class FeedbackItem {
        private String original;
        private String suggestion;
        private String explanation;
        /** "error" | "warning" | "info" */
        private String severity;
    }
}
