package com.example.english_learning_app.reading;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReadingPassageRepository extends JpaRepository<ReadingPassage, String> {
    List<ReadingPassage> findByLevel(String level);
}
