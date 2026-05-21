package com.example.english_learning_app.wordle;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class WordleServiceTest {

    @InjectMocks
    private WordleService wordleService;

    @Test
    void shouldStartGame_whenRequested() {
        WordleGame game = wordleService.startGame();
        assertThat(game).isNotNull();
        assertThat(game.getId()).isNotBlank();
        assertThat(game.getTargetWord()).hasSize(5);
        assertThat(game.getAttempts()).isEmpty();
        assertThat(game.getStatus()).isEqualTo(GameStatus.IN_PROGRESS);
    }

    @Test
    void shouldReturnGame_whenValidId() {
        WordleGame newGame = wordleService.startGame();
        WordleGame fetchedGame = wordleService.getGame(newGame.getId());
        
        assertThat(fetchedGame).isNotNull();
        assertThat(fetchedGame.getId()).isEqualTo(newGame.getId());
    }

    @Test
    void shouldThrowNotFound_whenInvalidId() {
        assertThrows(GameNotFoundException.class, () -> wordleService.getGame("invalid"));
    }

    @Test
    void shouldProcessGuess_whenValidGuess() {
        WordleGame game = wordleService.startGame();
        String guess = "APPLE"; // Just any 5-letter word
        GuessResult result = wordleService.submitGuess(game.getId(), guess);
        
        assertThat(result).isNotNull();
        assertThat(result.feedback()).hasSize(5);
        
        WordleGame fetchedGame = wordleService.getGame(game.getId());
        assertThat(fetchedGame.getAttempts()).hasSize(1);
    }
}
