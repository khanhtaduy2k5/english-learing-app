package com.example.english_learning_app.userprogress;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@Tag(name = "User Progress", description = "Track and persist study progress of lessons and quizzes")
@SecurityRequirement(name = "bearerAuth")
public class UserProgressController {

    private final UserProgressService userProgressService;

    public UserProgressController(UserProgressService userProgressService) {
        this.userProgressService = userProgressService;
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user progress", description = "Retrieve all lesson progress items of a user")
    public List<UserProgress> getUserProgress(@PathVariable String userId) {
        return userProgressService.getProgressByUserId(userId);
    }

    @GetMapping("/user/{userId}/lesson/{lessonId}")
    @Operation(summary = "Get specific lesson progress", description = "Retrieve progress details for a single lesson")
    public ResponseEntity<UserProgress> getLessonProgress(
            @PathVariable String userId,
            @PathVariable String lessonId) {
        return userProgressService.getProgress(userId, lessonId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Update study progress", description = "Record or update lesson study state and quiz score")
    public ResponseEntity<UserProgress> updateProgress(@Valid @RequestBody ProgressUpdateRequest request) {
        UserProgress updated = userProgressService.saveOrUpdateProgress(
                request.userId(),
                request.lessonId(),
                request.status(),
                request.quizScore()
        );
        return ResponseEntity.ok(updated);
    }

    public record ProgressUpdateRequest(
        @NotBlank String userId,
        @NotBlank String lessonId,
        @NotBlank String status, // not_started, in_progress, completed
        Integer quizScore
    ) {}
}
