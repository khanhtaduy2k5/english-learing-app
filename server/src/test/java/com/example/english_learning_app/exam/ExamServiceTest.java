package com.example.english_learning_app.exam;

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

class ExamServiceTest {

    private ExamRepository examRepository;
    private ExamService examService;

    @BeforeEach
    void setUp() {
        examRepository = mock(ExamRepository.class);
        examService = new ExamService(examRepository);
    }

    @Test
    void getAllExams_returnsListOfExams() {
        Exam exam1 = new Exam();
        Exam exam2 = new Exam();
        List<Exam> expected = Arrays.asList(exam1, exam2);
        when(examRepository.findAll()).thenReturn(expected);

        List<Exam> actual = examService.getAllExams();

        assertEquals(expected, actual);
        verify(examRepository).findAll();
    }

    @Test
    void getExam_returnsExamOptionalWhenFound() {
        Exam exam = new Exam();
        when(examRepository.findById("exam-123")).thenReturn(Optional.of(exam));

        Optional<Exam> actual = examService.getExam("exam-123");

        assertTrue(actual.isPresent());
        assertEquals(exam, actual.get());
        verify(examRepository).findById("exam-123");
    }

    @Test
    void getExam_returnsEmptyOptionalWhenNotFound() {
        when(examRepository.findById("non-existent")).thenReturn(Optional.empty());

        Optional<Exam> actual = examService.getExam("non-existent");

        assertTrue(actual.isEmpty());
        verify(examRepository).findById("non-existent");
    }
}
