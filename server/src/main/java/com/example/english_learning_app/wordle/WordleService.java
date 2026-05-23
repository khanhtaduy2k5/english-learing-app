package com.example.english_learning_app.wordle;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class WordleService {

    private final Map<String, WordleGame> games = new ConcurrentHashMap<>();
    
    // Sample dictionary for testing
    private static final List<String> DICTIONARY = List.of(
        "APPLE", "TRAIN", "HOUSE", "MOUSE", "BRICK", "WATER", "RIVER", "OCEAN", "SWORD", "MAGIC"
    );
    private final Random random = new Random();

    public WordleGame startGame() {
        String targetWord = DICTIONARY.get(random.nextInt(DICTIONARY.size()));
        WordleGame game = new WordleGame(targetWord);
        games.put(game.getId(), game);
        return game;
    }

    public WordleGame getGame(String id) {
        WordleGame game = games.get(id);
        if (game == null) {
            throw new GameNotFoundException("Game not found");
        }
        return game;
    }

    public GuessResult submitGuess(String gameId, String guess) {
        WordleGame game = getGame(gameId);
        
        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Game is already finished");
        }
        
        if (guess == null || guess.length() != 5) {
            throw new IllegalArgumentException("Guess must be exactly 5 letters");
        }
        
        guess = guess.toUpperCase();
        game.addAttempt(guess);
        
        List<LetterFeedback> feedback = generateFeedback(game.getTargetWord(), guess);
        
        if (guess.equals(game.getTargetWord())) {
            game.setStatus(GameStatus.WON);
        } else if (game.getAttempts().size() >= 6) {
            game.setStatus(GameStatus.LOST);
        }
        
        return new GuessResult(guess, feedback, game.getStatus());
    }

    public List<LetterFeedback> generateFeedback(String target, String guess) {
        List<LetterFeedback> feedback = new ArrayList<>(5);
        for (int i = 0; i < 5; i++) {
            feedback.add(LetterFeedback.ABSENT); // Initialize
        }
        
        boolean[] targetUsed = new boolean[5];
        
        // First pass: Correct matches
        for (int i = 0; i < 5; i++) {
            if (guess.charAt(i) == target.charAt(i)) {
                feedback.set(i, LetterFeedback.CORRECT);
                targetUsed[i] = true;
            }
        }
        
        // Second pass: Present matches
        for (int i = 0; i < 5; i++) {
            if (feedback.get(i) == LetterFeedback.CORRECT) continue;
            
            for (int j = 0; j < 5; j++) {
                if (!targetUsed[j] && guess.charAt(i) == target.charAt(j)) {
                    feedback.set(i, LetterFeedback.PRESENT);
                    targetUsed[j] = true;
                    break;
                }
            }
        }
        
        return feedback;
    }
}
