package com.example.english_learning_app.lesson;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

  private static final List<LessonDto> LESSONS = List.of(
      new LessonDto("1", "Greetings and Introductions", "Learn basic greetings and self-introductions.", "Beginner", "Simple dialogues for meeting new people."),
      new LessonDto("2", "Daily Routines", "Talk about everyday activities and habits.", "Beginner", "Useful vocabulary for morning, afternoon, and evening routines."),
      new LessonDto("3", "Travel Essentials", "Practice language for airports, hotels, and transport.", "Intermediate", "Common phrases for planning and enjoying a trip.")
  );

  @GetMapping
  public List<LessonSummaryDto> getLessons() {
    return LESSONS.stream()
        .map(lesson -> new LessonSummaryDto(lesson.id(), lesson.title(), lesson.description(), lesson.level()))
        .toList();
  }

  @GetMapping("/{lessonId}")
  public ResponseEntity<LessonDto> getLesson(@PathVariable String lessonId) {
    return LESSONS.stream()
        .filter(lesson -> lesson.id().equals(lessonId))
        .findFirst()
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping("/{lessonId}/quiz")
  public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable String lessonId) {
    return LESSONS.stream()
        .filter(lesson -> lesson.id().equals(lessonId))
        .findFirst()
        .map(lesson -> ResponseEntity.ok(new QuizResponseDto(lesson.id(), sampleQuizFor(lessonId))))
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  private List<QuizQuestionDto> sampleQuizFor(String lessonId) {
    return List.of(
        new QuizQuestionDto(
            lessonId + "-q1",
            "Which phrase is a greeting?",
            List.of("Good morning", "Turn left", "I am hungry", "See you later"),
            "Good morning"
        ),
        new QuizQuestionDto(
            lessonId + "-q2",
            "What does 'introduce yourself' mean?",
            List.of("Say your name", "Ask for directions", "Order food", "Book a hotel"),
            "Say your name"
        )
    );
  }

  public record LessonSummaryDto(String id, String title, String description, String level) {}

  public record LessonDto(String id, String title, String description, String level, String content) {}

  public record QuizResponseDto(String lessonId, List<QuizQuestionDto> questions) {}

  public record QuizQuestionDto(String id, String question, List<String> options, String answer) {}
}
