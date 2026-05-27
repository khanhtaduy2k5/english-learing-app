package com.example.english_learning_app.lesson;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

class LessonControllerTest {

    private LessonService lessonService;
    private LessonController lessonController;

    @BeforeEach
    void setUp() {
        lessonService = mock(LessonService.class);
        lessonController = new LessonController(lessonService);
    }

    @Test
    void getLessonsDelegatesToLevelFilterAndParsesLocale() {
        var summary = summary("lesson-1");
        when(lessonService.getLessonsByLevel("A1", "vi")).thenReturn(List.of(summary));

        List<LessonController.LessonSummaryDto> result = lessonController.getLessons("A1", null, null, "vi-VN,vi;q=0.9");

        assertEquals("lesson-1", result.get(0).id());
        verify(lessonService).getLessonsByLevel("A1", "vi");
    }

    @Test
    void getLessonsDelegatesToUnitFilterBeforeSkillFilter() {
        var summary = summary("lesson-2");
        when(lessonService.getLessonsByUnit("unit-1", "en")).thenReturn(List.of(summary));

        List<LessonController.LessonSummaryDto> result = lessonController.getLessons(null, "unit-1", "reading", null);

        assertEquals("lesson-2", result.get(0).id());
        verify(lessonService).getLessonsByUnit("unit-1", "en");
    }

    @Test
    void getLessonReturnsNotFoundWhenMissing() {
        when(lessonService.getLesson("missing", "en")).thenReturn(Optional.empty());

        ResponseEntity<LessonController.LessonDto> response = lessonController.getLesson("missing", "en");

        assertEquals(404, response.getStatusCode().value());
        assertNull(response.getBody());
    }

    @Test
    void getQuizReturnsOkWhenFound() {
        var quiz = new LessonController.QuizResponseDto("lesson-1", List.of(Map.of("question", "Choose one")));
        when(lessonService.getQuiz("lesson-1", "en")).thenReturn(Optional.of(quiz));

        ResponseEntity<LessonController.QuizResponseDto> response = lessonController.getQuiz("lesson-1", "");

        assertEquals(200, response.getStatusCode().value());
        assertEquals("lesson-1", response.getBody().lessonId());
    }

    private LessonController.LessonSummaryDto summary(String id) {
        return new LessonController.LessonSummaryDto(id, "unit-1", "A1", "reading", "Title", "Description", 10, 20);
    }
}
