package com.example.english_learning_app.wordle;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wordle")
public class WordleController {

    private final WordleService wordleService;

    public WordleController(WordleService wordleService) {
        this.wordleService = wordleService;
    }

    @PostMapping("/start")
    public ResponseEntity<WordleGame> startGame() {
        WordleGame game = wordleService.startGame();
        return ResponseEntity.status(HttpStatus.CREATED).body(game);
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<WordleGame> getGame(@PathVariable String gameId) {
        WordleGame game = wordleService.getGame(gameId);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/guess")
    public ResponseEntity<GuessResult> submitGuess(@PathVariable String gameId, @RequestBody GuessRequest request) {
        GuessResult result = wordleService.submitGuess(gameId, request.guess());
        return ResponseEntity.ok(result);
    }
    
    public record GuessRequest(String guess) {}
}
