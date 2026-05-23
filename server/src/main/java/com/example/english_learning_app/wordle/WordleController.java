package com.example.english_learning_app.wordle;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        WordleGame game = wordleService.startGame();
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(game));
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<WordleGameDto> getGame(@PathVariable String gameId) {
        WordleGame game = wordleService.getGame(gameId);
        return ResponseEntity.ok(mapToDto(game));
    }

    @PostMapping("/{gameId}/guess")
    public ResponseEntity<GuessResult> submitGuess(@PathVariable String gameId, @RequestBody GuessRequest request) {
        GuessResult result = wordleService.submitGuess(gameId, request.guess());
        return ResponseEntity.ok(result);
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
            6, // maxGuesses
            targetWord
        );
    }
    
    public record GuessRequest(String guess) {}
}
