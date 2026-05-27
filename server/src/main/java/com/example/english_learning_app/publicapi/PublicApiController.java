package com.example.english_learning_app.publicapi;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final PublicApiService publicApiService;

    public PublicApiController(PublicApiService publicApiService) {
        this.publicApiService = publicApiService;
    }

    @GetMapping("/quote")
    public ResponseEntity<QuoteResponse> getDailyQuote() {
        QuoteResponse quote = publicApiService.getDailyQuote();
        return ResponseEntity.ok(quote);
    }

    @GetMapping("/joke")
    public ResponseEntity<JokeResponse> getDailyJoke() {
        JokeResponse joke = publicApiService.getDailyJoke();
        return ResponseEntity.ok(joke);
    }

    @GetMapping("/trivia")
    public ResponseEntity<List<TriviaResponse>> getTriviaQuestions(
            @RequestParam(required = false) String difficulty
    ) {
        List<TriviaResponse> trivia = publicApiService.getTriviaQuestions(difficulty);
        return ResponseEntity.ok(trivia);
    }

    @GetMapping("/news")
    public ResponseEntity<List<NewsResponse>> getNewsArticles() {
        List<NewsResponse> news = publicApiService.getNewsArticles();
        return ResponseEntity.ok(news);
    }

    @GetMapping("/radio")
    public ResponseEntity<List<RadioResponse>> getEnglishRadioStations() {
        List<RadioResponse> radio = publicApiService.getEnglishRadioStations();
        return ResponseEntity.ok(radio);
    }
}
