package com.example.english_learning_app.publicapi;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.english_learning_app.config.JwtAuthenticationFilter;
import com.example.english_learning_app.config.SecurityConfig;

@WebMvcTest({PublicApiController.class})
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class PublicApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PublicApiService publicApiService;

    @Test
    void shouldReturnQuoteSuccessfully() throws Exception {
        QuoteResponse mockQuote = new QuoteResponse(
            "An unexamined life is not worth living.",
            "Socrates"
        );
        when(publicApiService.getDailyQuote()).thenReturn(mockQuote);

        mockMvc.perform(get("/api/public/quote"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value("An unexamined life is not worth living."))
            .andExpect(jsonPath("$.author").value("Socrates"));
    }

    @Test
    void shouldReturnJokeSuccessfully() throws Exception {
        JokeResponse mockJoke = new JokeResponse(
            "Why do programmers wear glasses?",
            "Because they can't C#."
        );
        when(publicApiService.getDailyJoke()).thenReturn(mockJoke);

        mockMvc.perform(get("/api/public/joke"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.setup").value("Why do programmers wear glasses?"))
            .andExpect(jsonPath("$.punchline").value("Because they can't C#."));
    }

    @Test
    void shouldReturnTriviaQuestionsSuccessfully() throws Exception {
        TriviaResponse mockTrivia = new TriviaResponse(
            "What is the capital of France?",
            "Paris",
            List.of("Paris", "London", "Berlin", "Rome"),
            "easy",
            "General Knowledge"
        );
        when(publicApiService.getTriviaQuestions("easy")).thenReturn(List.of(mockTrivia));

        mockMvc.perform(get("/api/public/trivia?difficulty=easy"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].question").value("What is the capital of France?"))
            .andExpect(jsonPath("$[0].correctAnswer").value("Paris"))
            .andExpect(jsonPath("$[0].answers[0]").value("Paris"))
            .andExpect(jsonPath("$[0].difficulty").value("easy"))
            .andExpect(jsonPath("$[0].category").value("General Knowledge"));
    }

    @Test
    void shouldReturnNewsArticlesSuccessfully() throws Exception {
        NewsResponse mockNews = new NewsResponse(
            "New Breakthrough in AI",
            "Researchers have developed a more efficient algorithm.",
            "Full content of the breakthrough in AI...",
            "https://example.com/ai",
            "https://example.com/image.jpg",
            "2026-05-27T00:00:00Z",
            "Medium"
        );
        when(publicApiService.getNewsArticles()).thenReturn(List.of(mockNews));

        mockMvc.perform(get("/api/public/news"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("New Breakthrough in AI"))
            .andExpect(jsonPath("$[0].description").value("Researchers have developed a more efficient algorithm."))
            .andExpect(jsonPath("$[0].content").value("Full content of the breakthrough in AI..."))
            .andExpect(jsonPath("$[0].url").value("https://example.com/ai"))
            .andExpect(jsonPath("$[0].urlToImage").value("https://example.com/image.jpg"))
            .andExpect(jsonPath("$[0].readability").value("Medium"));
    }

    @Test
    void shouldReturnEnglishRadioStationsSuccessfully() throws Exception {
        RadioResponse mockRadio = new RadioResponse(
            "BBC Radio 4",
            "http://stream.live.vc.bbc.co.uk/bbc_radio_fourfm",
            "https://example.com/bbc.png",
            "GB",
            "news,talk"
        );
        when(publicApiService.getEnglishRadioStations()).thenReturn(List.of(mockRadio));

        mockMvc.perform(get("/api/public/radio"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("BBC Radio 4"))
            .andExpect(jsonPath("$[0].url").value("http://stream.live.vc.bbc.co.uk/bbc_radio_fourfm"))
            .andExpect(jsonPath("$[0].favicon").value("https://example.com/bbc.png"))
            .andExpect(jsonPath("$[0].country").value("GB"))
            .andExpect(jsonPath("$[0].tags").value("news,talk"));
    }
}
