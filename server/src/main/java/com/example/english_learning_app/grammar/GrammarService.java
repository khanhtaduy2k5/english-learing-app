package com.example.english_learning_app.grammar;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class GrammarService {

    private final GrammarRuleRepository grammarRuleRepository;

    public GrammarService(GrammarRuleRepository grammarRuleRepository) {
        this.grammarRuleRepository = grammarRuleRepository;
    }

    public List<GrammarRule> getAllRules() {
        return grammarRuleRepository.findAll();
    }

    public List<GrammarRule> getRulesByLevel(String level) {
        return grammarRuleRepository.findByLevel(level);
    }

    public Optional<GrammarRule> getRule(String id) {
        return grammarRuleRepository.findById(id);
    }
}
