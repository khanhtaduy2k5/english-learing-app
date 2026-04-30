package com.example.english_learning_app.lesson;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class LessonService {

  private final LessonRepository lessonRepository;

  public LessonService(LessonRepository lessonRepository) {
    this.lessonRepository = lessonRepository;
  }

  public List<LessonController.LessonSummaryDto> getLessons() {
    return lessonRepository.findAll().stream()
        .map(lesson -> new LessonController.LessonSummaryDto(
            lesson.id(),
            lesson.title(),
            lesson.description(),
            lesson.level()))
        .toList();
  }

  public Optional<LessonController.LessonDto> getLesson(String lessonId) {
    return lessonRepository.findById(lessonId)
        .map(lesson -> new LessonController.LessonDto(
            lesson.id(),
            lesson.title(),
            lesson.description(),
            lesson.level(),
            lesson.content()));
  }

  public Optional<LessonController.QuizResponseDto> getQuiz(String lessonId) {
    return lessonRepository.findById(lessonId)
        .map(lesson -> new LessonController.QuizResponseDto(lesson.id(), sampleQuizFor(lessonId)));
  }

  private List<LessonController.QuizQuestionDto> sampleQuizFor(String lessonId) {
    return List.of(
        new LessonController.QuizQuestionDto(
            lessonId + "-q1",
            "Which phrase is a greeting?",
            List.of("Good morning", "Turn left", "I am hungry", "See you later"),
            "Good morning"
        ),
        new LessonController.QuizQuestionDto(
            lessonId + "-q2",
            "What does 'introduce yourself' mean?",
            List.of("Say your name", "Ask for directions", "Order food", "Book a hotel"),
            "Say your name"
        )
    );
  }
}