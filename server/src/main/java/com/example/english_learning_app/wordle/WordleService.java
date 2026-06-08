package com.example.english_learning_app.wordle;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class WordleService {

    private final Map<String, WordleGame> games = new ConcurrentHashMap<>();
    
    // Rich vocabulary of 80 popular 5-letter English words
    private static final List<String> DICTIONARY = List.of(
        // Nature & Elements
        "EARTH", "RIVER", "OCEAN", "WATER", "PLANT", "GRASS", "STONE", "CLOUD", "RAINY", "SUNNY",
        "BEACH", "FLOWER", "STORM", "LIGHT", "NIGHT", "SPACE", "WORLD", "FLAME", "SHINE", "SHADE",
        // Animals
        "MOUSE", "TIGER", "PANDA", "EAGLE", "SHARK", "WHALE", "ZEBRA", "HORSE", "KOALA", "CAMEL",
        // Objects & Lifestyle
        "HOUSE", "CHAIR", "TABLE", "CLOCK", "GLASS", "KNIFE", "SPOON", "PAPER", "BOARD", "PHONE",
        "BRICK", "TRAIN", "TRUCK", "PLANE", "SHIRT", "JEANS", "SMILE", "HEART", "DREAM", "CROWN",
        // Learning & Food
        "APPLE", "BREAD", "FRUIT", "SWEET", "HONEY", "MUSIC", "MAGIC", "SWORD", "BOOKS", "STUDY",
        "LEARN", "CLASS", "TEACH", "WRITE", "SPEAK", "SOUND", "SMART", "BRAIN", "THINK", "YOUTH",
        // Adjectives & General
        "GREAT", "HAPPY", "GREEN", "BLACK", "WHITE", "BROWN", "FRESH", "CLEAN", "QUICK", "QUIET",
        "ALERT", "ABOUT", "BRING", "DRAFT", "FLUTE", "LEMON", "PIECE", "PIZZA", "RADIO", "VOICE"
    );
    private final Random random = new Random();

    public WordleGame startGame(String userId) {
        String targetWord = DICTIONARY.get(random.nextInt(DICTIONARY.size()));
        WordleGame game = new WordleGame(targetWord, userId);
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Game is already finished");
        }
        
        if (guess == null || !guess.matches("^[a-zA-Z]{5}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guess must be exactly 5 letters and contain only alphabetic characters");
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
