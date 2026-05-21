package com.example.english_learning_app.wordle;

import java.util.List;

public record GuessResult(String guess, List<LetterFeedback> feedback, GameStatus status) {}
