package com.example.english_learning_app.grammar;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GrammarServiceTest {

    private GrammarRuleRepository grammarRuleRepository;
    private GrammarService grammarService;

    @BeforeEach
    void setUp() {
        grammarRuleRepository = mock(GrammarRuleRepository.class);
        grammarService = new GrammarService(grammarRuleRepository);
    }

    @Test
    void getAllRules_returnsListOfRules() {
        GrammarRule rule1 = new GrammarRule();
        GrammarRule rule2 = new GrammarRule();
        List<GrammarRule> expected = Arrays.asList(rule1, rule2);
        when(grammarRuleRepository.findAll()).thenReturn(expected);

        List<GrammarRule> actual = grammarService.getAllRules();

        assertEquals(expected, actual);
        verify(grammarRuleRepository).findAll();
    }

    @Test
    void getRulesByLevel_returnsFilteredRules() {
        GrammarRule rule = new GrammarRule();
        List<GrammarRule> expected = Arrays.asList(rule);
        when(grammarRuleRepository.findByLevel("A1")).thenReturn(expected);

        List<GrammarRule> actual = grammarService.getRulesByLevel("A1");

        assertEquals(expected, actual);
        verify(grammarRuleRepository).findByLevel("A1");
    }

    @Test
    void getRule_returnsRuleOptionalWhenFound() {
        GrammarRule rule = new GrammarRule();
        when(grammarRuleRepository.findById("rule-1")).thenReturn(Optional.of(rule));

        Optional<GrammarRule> actual = grammarService.getRule("rule-1");

        assertTrue(actual.isPresent());
        assertEquals(rule, actual.get());
        verify(grammarRuleRepository).findById("rule-1");
    }

    @Test
    void getRule_returnsEmptyOptionalWhenNotFound() {
        when(grammarRuleRepository.findById("non-existent")).thenReturn(Optional.empty());

        Optional<GrammarRule> actual = grammarService.getRule("non-existent");

        assertTrue(actual.isEmpty());
        verify(grammarRuleRepository).findById("non-existent");
    }
}
