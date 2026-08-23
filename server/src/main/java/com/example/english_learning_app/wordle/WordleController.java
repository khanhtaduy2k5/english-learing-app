package com.example.english_learning_app.wordle;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/wordle")
public class WordleController {

    private final WordleService wordleService;

    public WordleController(WordleService wordleService) {
        this.wordleService = wordleService;
    }

    @PostMapping("/start")
    public ResponseEntity<WordleGameDto> startGame() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        WordleGame game = wordleService.startGame(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(game));
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<WordleGameDto> getGame(@PathVariable String gameId) {
        String userId = currentUserId();
        WordleGame game = wordleService.getGame(gameId);
        requireOwnership(game, userId);
        return ResponseEntity.ok(mapToDto(game));
    }

    @PostMapping("/{gameId}/guess")
    public ResponseEntity<GuessResult> submitGuess(@PathVariable String gameId, @RequestBody GuessRequest request) {
        String userId = currentUserId();
        WordleGame game = wordleService.getGame(gameId);
        requireOwnership(game, userId);
        GuessResult result = wordleService.submitGuess(gameId, request.guess());
        return ResponseEntity.ok(result);
    }

    private String currentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void requireOwnership(WordleGame game, String userId) {
        if (game.getUserId() != null && !game.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this game");
        }
    }

    private WordleGameDto mapToDto(WordleGame game) {
        List<GuessResult> guesses = new ArrayList<>();
        for (String attempt : game.getAttempts()) {
            List<LetterFeedback> feedback = wordleService.generateFeedback(game.getTargetWord(), attempt);
            guesses.add(new GuessResult(attempt, feedback, game.getStatus()));
        }

        // Hide target word unless game is WON or LOST for anti-cheat security
        String targetWord = null;
        if (game.getStatus() == GameStatus.WON || game.getStatus() == GameStatus.LOST) {
            targetWord = game.getTargetWord();
        }

        return new WordleGameDto(
            game.getId(),
            game.getStatus(),
            guesses,
            WordleService.MAX_ATTEMPTS,
            targetWord
        );
    }
    
    public record GuessRequest(String guess) {}
}
