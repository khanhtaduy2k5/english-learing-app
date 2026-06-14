package com.example.english_learning_app.level;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LevelServiceTest {

    private LevelRepository levelRepository;
    private LevelService levelService;

    @BeforeEach
    void setUp() {
        levelRepository = mock(LevelRepository.class);
        levelService = new LevelService(levelRepository);
    }

    @Test
    void getLevels_returnsListOfLevels() {
        Level level1 = new Level();
        Level level2 = new Level();
        List<Level> expected = Arrays.asList(level1, level2);
        when(levelRepository.findAll()).thenReturn(expected);

        List<Level> actual = levelService.getLevels();

        assertEquals(expected, actual);
        verify(levelRepository).findAll();
    }

    @Test
    void getLevel_returnsLevelOptionalWhenFound() {
        Level level = new Level();
        when(levelRepository.findById("A1")).thenReturn(Optional.of(level));

        Optional<Level> actual = levelService.getLevel("A1");

        assertTrue(actual.isPresent());
        assertEquals(level, actual.get());
        verify(levelRepository).findById("A1");
    }

    @Test
    void getLevel_returnsEmptyOptionalWhenNotFound() {
        when(levelRepository.findById("non-existent")).thenReturn(Optional.empty());

        Optional<Level> actual = levelService.getLevel("non-existent");

        assertTrue(actual.isEmpty());
        verify(levelRepository).findById("non-existent");
    }
}
