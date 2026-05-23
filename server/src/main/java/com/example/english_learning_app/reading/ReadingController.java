package com.example.english_learning_app.reading;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/reading")
@Tag(name = "Reading", description = "Query reading comprehension passages and questions")
@SecurityRequirement(name = "bearerAuth")
public class ReadingController {

    private final ReadingService readingService;

    public ReadingController(ReadingService readingService) {
        this.readingService = readingService;
    }

    @GetMapping
    @Operation(summary = "Get reading passages", description = "Retrieve list of all reading passages, optionally filtered by level")
    public List<ReadingPassage> getReadingPassages(@RequestParam(required = false) String level) {
        if (level != null && !level.isBlank()) {
            return readingService.getPassagesByLevel(level);
        }
        return readingService.getAllPassages();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get reading passage by ID", description = "Retrieve a single passage text and associated comprehension questions")
    public ResponseEntity<ReadingPassage> getReadingPassage(@PathVariable String id) {
        return readingService.getPassage(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
