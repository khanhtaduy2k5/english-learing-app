package com.example.english_learning_app.userprogress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Integer> {
    List<UserProgress> findByUserId(String userId);
    Optional<UserProgress> findByUserIdAndLessonId(String userId, String lessonId);
}
