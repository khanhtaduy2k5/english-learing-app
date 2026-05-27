package com.example.english_learning_app.publicapi;

import java.util.List;

public record TriviaResponse(
    String question,
    String correctAnswer,
    List<String> answers,
    String difficulty,
    String category
) {
}
