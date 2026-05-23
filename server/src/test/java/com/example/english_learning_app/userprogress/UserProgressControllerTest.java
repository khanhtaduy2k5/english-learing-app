package com.example.english_learning_app.userprogress;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.OffsetDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserProgressControllerTest {

    @Mock
    private UserProgressService userProgressService;

    private UserProgressController userProgressController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userProgressController = new UserProgressController(userProgressService);
    }

    @Test
    void shouldReturnUserProgressList() {
        UserProgress up1 = new UserProgress(1, "u1", "lesson-1", "completed", 90, OffsetDateTime.now(), OffsetDateTime.now(), OffsetDateTime.now());
        when(userProgressService.getProgressByUserId("u1")).thenReturn(Collections.singletonList(up1));

        List<UserProgress> result = userProgressController.getUserProgress("u1");

        assertEquals(1, result.size());
        assertEquals("lesson-1", result.get(0).getLessonId());
        verify(userProgressService, times(1)).getProgressByUserId("u1");
    }

    @Test
    void shouldReturnSpecificLessonProgress_whenFound() {
        UserProgress up = new UserProgress(1, "u1", "lesson-1", "completed", 90, OffsetDateTime.now(), OffsetDateTime.now(), OffsetDateTime.now());
        when(userProgressService.getProgress("u1", "lesson-1")).thenReturn(Optional.of(up));

        ResponseEntity<UserProgress> response = userProgressController.getLessonProgress("u1", "lesson-1");

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertNotNull(response.getBody());
        assertEquals("completed", response.getBody().getStatus());
    }

    @Test
    void shouldUpdateProgressSuccessfully() {
        UserProgress updated = new UserProgress(1, "u1", "lesson-1", "completed", 95, OffsetDateTime.now(), OffsetDateTime.now(), OffsetDateTime.now());
        when(userProgressService.saveOrUpdateProgress("u1", "lesson-1", "completed", 95)).thenReturn(updated);

        UserProgressController.ProgressUpdateRequest request = new UserProgressController.ProgressUpdateRequest("u1", "lesson-1", "completed", 95);
        ResponseEntity<UserProgress> response = userProgressController.updateProgress(request);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertNotNull(response.getBody());
        assertEquals(95, response.getBody().getQuizScore());
        verify(userProgressService, times(1)).saveOrUpdateProgress("u1", "lesson-1", "completed", 95);
    }
}
