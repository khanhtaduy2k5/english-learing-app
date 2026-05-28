package com.example.english_learning_app.writing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WritingFeedbackLogRepository extends JpaRepository<WritingFeedbackLog, Integer> {
}
