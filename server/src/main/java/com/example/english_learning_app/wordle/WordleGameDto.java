package com.example.english_learning_app.wordle;

import java.util.List;

public record WordleGameDto(
    String id,
    GameStatus status,
    List<GuessResult> guesses,
    int maxGuesses,
    String targetWord
) {}
