package com.example.english_learning_app.lesson.vocab;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, String> {
    Optional<Vocabulary> findByWordIgnoreCase(String word);
}
