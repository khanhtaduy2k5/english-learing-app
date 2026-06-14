package com.example.english_learning_app.reading;

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

class ReadingServiceTest {

    private ReadingPassageRepository readingPassageRepository;
    private ReadingService readingService;

    @BeforeEach
    void setUp() {
        readingPassageRepository = mock(ReadingPassageRepository.class);
        readingService = new ReadingService(readingPassageRepository);
    }

    @Test
    void getAllPassages_returnsListOfPassages() {
        ReadingPassage passage1 = new ReadingPassage();
        ReadingPassage passage2 = new ReadingPassage();
        List<ReadingPassage> expected = Arrays.asList(passage1, passage2);
        when(readingPassageRepository.findAll()).thenReturn(expected);

        List<ReadingPassage> actual = readingService.getAllPassages();

        assertEquals(expected, actual);
        verify(readingPassageRepository).findAll();
    }

    @Test
    void getPassagesByLevel_returnsFilteredPassages() {
        ReadingPassage passage = new ReadingPassage();
        List<ReadingPassage> expected = Arrays.asList(passage);
        when(readingPassageRepository.findByLevel("B2")).thenReturn(expected);

        List<ReadingPassage> actual = readingService.getPassagesByLevel("B2");

        assertEquals(expected, actual);
        verify(readingPassageRepository).findByLevel("B2");
    }

    @Test
    void getPassage_returnsPassageOptionalWhenFound() {
        ReadingPassage passage = new ReadingPassage();
        when(readingPassageRepository.findById("p-1")).thenReturn(Optional.of(passage));

        Optional<ReadingPassage> actual = readingService.getPassage("p-1");

        assertTrue(actual.isPresent());
        assertEquals(passage, actual.get());
        verify(readingPassageRepository).findById("p-1");
    }

    @Test
    void getPassage_returnsEmptyOptionalWhenNotFound() {
        when(readingPassageRepository.findById("non-existent")).thenReturn(Optional.empty());

        Optional<ReadingPassage> actual = readingService.getPassage("non-existent");

        assertTrue(actual.isEmpty());
        verify(readingPassageRepository).findById("non-existent");
    }
}
