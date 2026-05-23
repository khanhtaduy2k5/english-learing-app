package com.example.english_learning_app.exam;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.OffsetDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExamControllerTest {

    @Mock
    private ExamService examService;

    private ExamController examController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        examController = new ExamController(examService);
    }

    @Test
    void shouldReturnAllExams() {
        Exam exam1 = new Exam("e1", "IELTS", "International English Language Testing System", "🇬🇧", "Desc", new HashMap<>(), new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        Exam exam2 = new Exam("e2", "TOEIC", "Test of English for International Communication", "🇺🇸", "Desc", new HashMap<>(), new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        
        when(examService.getAllExams()).thenReturn(Arrays.asList(exam1, exam2));

        List<Exam> result = examController.getExams();

        assertEquals(2, result.size());
        verify(examService, times(1)).getAllExams();
    }

    @Test
    void shouldReturnExamById_whenFound() {
        Exam exam = new Exam("e1", "IELTS", "International English Language Testing System", "🇬🇧", "Desc", new HashMap<>(), new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        when(examService.getExam("e1")).thenReturn(Optional.of(exam));

        ResponseEntity<Exam> response = examController.getExam("e1");

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertNotNull(response.getBody());
        assertEquals("e1", response.getBody().getId());
    }
}
