package com.example.english_learning_app.grammar;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/grammar")
@Tag(name = "Grammar", description = "Query grammar rules and structural practices")
@SecurityRequirement(name = "bearerAuth")
public class GrammarController {

    private final GrammarService grammarService;

    public GrammarController(GrammarService grammarService) {
        this.grammarService = grammarService;
    }

    @GetMapping
    @Operation(summary = "Get grammar rules", description = "Retrieve list of all grammar rules, optionally filtered by level")
    public List<GrammarRule> getGrammarRules(@RequestParam(required = false) String level) {
        if (level != null && !level.isBlank()) {
            return grammarService.getRulesByLevel(level);
        }
        return grammarService.getAllRules();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get grammar rule by ID", description = "Retrieve details and questions for a single grammar topic")
    public ResponseEntity<GrammarRule> getGrammarRule(@PathVariable String id) {
        return grammarService.getRule(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
