package com.example.english_learning_app.wordle;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class WordleGame {
    private String id;
    private String targetWord;
    private List<String> attempts;
    private GameStatus status;

    public WordleGame(String targetWord) {
        this.id = UUID.randomUUID().toString();
        this.targetWord = targetWord;
        this.attempts = new ArrayList<>();
        this.status = GameStatus.IN_PROGRESS;
    }

    public String getId() { return id; }
    public String getTargetWord() { return targetWord; }
    public List<String> getAttempts() { return attempts; }
    public GameStatus getStatus() { return status; }
    
    public void addAttempt(String guess) {
        this.attempts.add(guess);
    }
    
    public void setStatus(GameStatus status) {
        this.status = status;
    }
}
