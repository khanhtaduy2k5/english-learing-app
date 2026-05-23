package com.example.english_learning_app.grammar;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import java.time.OffsetDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GrammarControllerTest {

    @Mock
    private GrammarService grammarService;

    private GrammarController grammarController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        grammarController = new GrammarController(grammarService);
    }

    @Test
    void shouldReturnAllGrammarRules_whenNoLevelProvided() {
        GrammarRule rule1 = new GrammarRule("g1", "A1", "Present Simple", "Usage formula...", new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        GrammarRule rule2 = new GrammarRule("g2", "B1", "Conditionals", "If clauses...", new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        
        when(grammarService.getAllRules()).thenReturn(Arrays.asList(rule1, rule2));

        List<GrammarRule> result = grammarController.getGrammarRules(null);

        assertEquals(2, result.size());
        verify(grammarService, times(1)).getAllRules();
    }

    @Test
    void shouldReturnRulesFilteredByLevel_whenLevelProvided() {
        GrammarRule rule1 = new GrammarRule("g1", "A1", "Present Simple", "Usage formula...", new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        when(grammarService.getRulesByLevel("A1")).thenReturn(Collections.singletonList(rule1));

        List<GrammarRule> result = grammarController.getGrammarRules("A1");

        assertEquals(1, result.size());
        assertEquals("A1", result.get(0).getLevel());
        verify(grammarService, times(1)).getRulesByLevel("A1");
    }

    @Test
    void shouldReturnGrammarRuleById_whenFound() {
        GrammarRule rule = new GrammarRule("g1", "A1", "Present Simple", "Usage formula...", new ArrayList<>(), new ArrayList<>(), OffsetDateTime.now());
        when(grammarService.getRule("g1")).thenReturn(Optional.of(rule));

        ResponseEntity<GrammarRule> response = grammarController.getGrammarRule("g1");

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertNotNull(response.getBody());
        assertEquals("g1", response.getBody().getId());
    }
}
