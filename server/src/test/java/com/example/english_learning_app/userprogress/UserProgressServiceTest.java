package com.example.english_learning_app.userprogress;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserProgressServiceTest {

    private UserProgressRepository userProgressRepository;
    private UserProgressService userProgressService;

    @BeforeEach
    void setUp() {
        userProgressRepository = mock(UserProgressRepository.class);
        userProgressService = new UserProgressService(userProgressRepository);
    }

    @Test
    void getProgressByUserId_delegatesToRepository() {
        UserProgress up = new UserProgress();
        List<UserProgress> expected = Arrays.asList(up);
        when(userProgressRepository.findByUserId("user-1")).thenReturn(expected);

        List<UserProgress> actual = userProgressService.getProgressByUserId("user-1");

        assertEquals(expected, actual);
        verify(userProgressRepository).findByUserId("user-1");
    }

    @Test
    void getProgress_delegatesToRepository() {
        UserProgress up = new UserProgress();
        when(userProgressRepository.findByUserIdAndLessonId("user-1", "lesson-2")).thenReturn(Optional.of(up));

        Optional<UserProgress> actual = userProgressService.getProgress("user-1", "lesson-2");

        assertTrue(actual.isPresent());
        assertEquals(up, actual.get());
        verify(userProgressRepository).findByUserIdAndLessonId("user-1", "lesson-2");
    }

    @Test
    void saveOrUpdateProgress_createsNewProgress() {
        when(userProgressRepository.findByUserIdAndLessonId("user-1", "lesson-2")).thenReturn(Optional.empty());
        when(userProgressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));

        UserProgress result = userProgressService.saveOrUpdateProgress("user-1", "lesson-2", "completed", 95);

        assertNotNull(result);
        assertEquals("user-1", result.getUserId());
        assertEquals("lesson-2", result.getLessonId());
        assertEquals("completed", result.getStatus());
        assertEquals(95, result.getQuizScore());
        assertNotNull(result.getCompletedAt());
        verify(userProgressRepository).save(any(UserProgress.class));
    }

    @Test
    void saveOrUpdateProgress_updatesExistingProgress() {
        UserProgress existing = new UserProgress();
        existing.setUserId("user-1");
        existing.setLessonId("lesson-2");
        existing.setStatus("in_progress");
        existing.setQuizScore(50);

        when(userProgressRepository.findByUserIdAndLessonId("user-1", "lesson-2")).thenReturn(Optional.of(existing));
        when(userProgressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));

        UserProgress result = userProgressService.saveOrUpdateProgress("user-1", "lesson-2", "completed", 100);

        assertNotNull(result);
        assertEquals("completed", result.getStatus());
        assertEquals(100, result.getQuizScore());
        assertNotNull(result.getCompletedAt());
        verify(userProgressRepository).save(existing);
    }
}
