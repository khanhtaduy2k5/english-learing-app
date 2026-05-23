package com.example.english_learning_app.grammar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GrammarRuleRepository extends JpaRepository<GrammarRule, String> {
    List<GrammarRule> findByLevel(String level);
}
