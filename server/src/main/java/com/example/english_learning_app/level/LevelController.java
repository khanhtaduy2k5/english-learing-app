package com.example.english_learning_app.level;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/levels")
@Tag(name = "Levels", description = "Query levels (A1, A2, B1, etc.)")
@SecurityRequirement(name = "bearerAuth")
public class LevelController {

    private final LevelService levelService;

    public LevelController(LevelService levelService) {
        this.levelService = levelService;
    }

    @GetMapping
    @Operation(summary = "Get all levels", description = "Retrieve list of all language levels")
    public List<Level> getLevels() {
        return levelService.getLevels();
    }

    @GetMapping("/{levelId}")
    @Operation(summary = "Get level by ID", description = "Retrieve level details")
    public ResponseEntity<Level> getLevel(@PathVariable String levelId) {
        return levelService.getLevel(levelId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
