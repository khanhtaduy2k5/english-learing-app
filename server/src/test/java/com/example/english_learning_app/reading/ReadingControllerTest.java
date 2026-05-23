package com.example.english_learning_app.reading;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.OffsetDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReadingControllerTest {

    @Mock
    private ReadingService readingService;

    private ReadingController readingController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        readingController = new ReadingController(readingService);
    }

    @Test
    void shouldReturnAllPassages_whenNoFilter() {
        ReadingPassage p1 = new ReadingPassage("p1", "A1", "My Day", "Text...", new ArrayList<>(), OffsetDateTime.now());
        ReadingPassage p2 = new ReadingPassage("p2", "A2", "Travel", "Text...", new ArrayList<>(), OffsetDateTime.now());
        
        when(readingService.getAllPassages()).thenReturn(Arrays.asList(p1, p2));

        List<ReadingPassage> result = readingController.getReadingPassages(null);

        assertEquals(2, result.size());
        verify(readingService, times(1)).getAllPassages();
    }

    @Test
    void shouldReturnPassagesByLevel_whenLevelFilterProvided() {
        ReadingPassage p1 = new ReadingPassage("p1", "A1", "My Day", "Text...", new ArrayList<>(), OffsetDateTime.now());
        when(readingService.getPassagesByLevel("A1")).thenReturn(Collections.singletonList(p1));

        List<ReadingPassage> result = readingController.getReadingPassages("A1");

        assertEquals(1, result.size());
        assertEquals("A1", result.get(0).getLevel());
        verify(readingService, times(1)).getPassagesByLevel("A1");
    }

    @Test
    void shouldReturnPassageById_whenFound() {
        ReadingPassage p = new ReadingPassage("p1", "A1", "My Day", "Text...", new ArrayList<>(), OffsetDateTime.now());
        when(readingService.getPassage("p1")).thenReturn(Optional.of(p));

        ResponseEntity<ReadingPassage> response = readingController.getReadingPassage("p1");

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertNotNull(response.getBody());
        assertEquals("p1", response.getBody().getId());
    }
}
