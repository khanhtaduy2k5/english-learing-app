package com.example.english_learning_app.wordle;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class WordleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WordleService wordleService;

    @InjectMocks
    private WordleController wordleController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(wordleController).build();
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("u1", null, Collections.emptyList())
        );
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReturn201_whenStartGame() throws Exception {
        WordleGame game = new WordleGame("APPLE", "u1");
        when(wordleService.startGame("u1")).thenReturn(game);

        mockMvc.perform(post("/api/wordle/start"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(game.getId()))
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void shouldReturn200_whenGetGame() throws Exception {
        WordleGame game = new WordleGame("APPLE", "u1");
        when(wordleService.getGame(game.getId())).thenReturn(game);

        mockMvc.perform(get("/api/wordle/" + game.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(game.getId()));
    }

    @Test
    void shouldReturn404_whenGameNotFound() throws Exception {
        when(wordleService.getGame(anyString())).thenThrow(new GameNotFoundException("Not found"));

        mockMvc.perform(get("/api/wordle/invalid-id"))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn200_whenSubmitGuess() throws Exception {
        WordleGame game = new WordleGame("APPLE", "u1");
        GuessResult result = new GuessResult("APPLE", List.of(LetterFeedback.CORRECT, LetterFeedback.CORRECT, LetterFeedback.CORRECT, LetterFeedback.CORRECT, LetterFeedback.CORRECT), GameStatus.WON);
        when(wordleService.getGame("game-123")).thenReturn(game);
        when(wordleService.submitGuess("game-123", "APPLE")).thenReturn(result);

        mockMvc.perform(post("/api/wordle/game-123/guess")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"guess": "APPLE"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("WON"))
            .andExpect(jsonPath("$.feedback[0]").value("CORRECT"));
    }
}
