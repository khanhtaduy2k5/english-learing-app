package com.example.english_learning_app.lesson;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public class LessonRepository {

  private static final List<LessonRecord> LESSONS = List.of(
      new LessonRecord("1", "Greetings and Introductions", "Learn basic greetings and self-introductions.", "Beginner", "Simple dialogues for meeting new people."),
      new LessonRecord("2", "Daily Routines", "Talk about everyday activities and habits.", "Beginner", "Useful vocabulary for morning, afternoon, and evening routines."),
      new LessonRecord("3", "Travel Essentials", "Practice language for airports, hotels, and transport.", "Intermediate", "Common phrases for planning and enjoying a trip.")
  );

  public List<LessonRecord> findAll() {
    return LESSONS;
  }

  public Optional<LessonRecord> findById(String lessonId) {
    return LESSONS.stream()
        .filter(lesson -> lesson.id().equals(lessonId))
        .findFirst();
  }
}