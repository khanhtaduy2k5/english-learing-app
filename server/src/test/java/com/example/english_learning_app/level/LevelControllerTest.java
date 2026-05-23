package com.example.english_learning_app.level;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LevelControllerTest {

    @Mock
    private LevelService levelService;

    private LevelController levelController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        levelController = new LevelController(levelService);
    }

    @Test
    void shouldReturnAllLevels() {
        Level a1 = new Level("A1", "Beginner", "Elementary grammar", OffsetDateTime.now());
        Level a2 = new Level("A2", "Elementary", "Basic conversations", OffsetDateTime.now());
        
        when(levelService.getLevels()).thenReturn(Arrays.asList(a1, a2));

        List<Level> result = levelController.getLevels();

        assertEquals(2, result.size());
        assertEquals("A1", result.get(0).getLevel());
        assertEquals("A2", result.get(1).getLevel());
        verify(levelService, times(1)).getLevels();
    }

    @Test
    void shouldReturnLevelById_whenFound() {
        Level b1 = new Level("B1", "Intermediate", "Work and study topics", OffsetDateTime.now());
        when(levelService.getLevel("B1")).thenReturn(Optional.of(b1));

        ResponseEntity<Level> response = levelController.getLevel("B1");

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertNotNull(response.getBody());
        assertEquals("B1", response.getBody().getLevel());
    }

    @Test
    void shouldReturn404_whenLevelNotFound() {
        when(levelService.getLevel("C3")).thenReturn(Optional.empty());

        ResponseEntity<Level> response = levelController.getLevel("C3");

        assertTrue(response.getStatusCode().is4xxClientError());
        assertNull(response.getBody());
    }
}
