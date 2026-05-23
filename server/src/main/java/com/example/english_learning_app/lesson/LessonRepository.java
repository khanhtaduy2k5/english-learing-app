package com.example.english_learning_app.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {
    List<Lesson> findByLevel(String level);
    List<Lesson> findByUnitId(String unitId);
    List<Lesson> findBySkill(String skill);
}