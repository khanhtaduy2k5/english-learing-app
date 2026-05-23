package com.example.english_learning_app.lesson;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/lessons")
@Tag(name = "Lessons", description = "Lesson catalog, lesson detail, and quiz endpoints")
@SecurityRequirement(name = "bearerAuth")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping
    @Operation(summary = "List lessons", description = "Return the available lesson summaries with optional level, unitId, or skill filter")
    @ApiResponse(responseCode = "200", description = "Lesson list returned")
    public List<LessonSummaryDto> getLessons(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String unitId,
            @RequestParam(required = false) String skill) {
        if (level != null && !level.isBlank()) {
            return lessonService.getLessonsByLevel(level);
        } else if (unitId != null && !unitId.isBlank()) {
            return lessonService.getLessonsByUnit(unitId);
        } else if (skill != null && !skill.isBlank()) {
            return lessonService.getLessonsBySkill(skill);
        }
        return lessonService.getLessons();
    }

    @GetMapping("/{lessonId}")
    @Operation(summary = "Get lesson", description = "Return full lesson details for a lesson id")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lesson found", content = @Content(schema = @Schema(implementation = LessonDto.class))),
        @ApiResponse(responseCode = "404", description = "Lesson not found")
    })
    public ResponseEntity<LessonDto> getLesson(@PathVariable String lessonId) {
        return lessonService.getLesson(lessonId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{lessonId}/quiz")
    @Operation(summary = "Get lesson quiz", description = "Return the quiz questions for a specific lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Quiz found", content = @Content(schema = @Schema(implementation = QuizResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Quiz not found")
    })
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable String lessonId) {
        return lessonService.getQuiz(lessonId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public record LessonSummaryDto(
        @Schema(description = "Lesson id", example = "1") String id,
        @Schema(description = "Unit id", example = "unit-1") String unitId,
        @Schema(description = "Lesson level", example = "A1") String level,
        @Schema(description = "Lesson skill", example = "speaking") String skill,
        @Schema(description = "Lesson title", example = "Greetings and Introductions") String title,
        @Schema(description = "Short lesson summary", example = "Learn basic greetings.") String description,
        @Schema(description = "Estimated duration in minutes", example = "15") Integer duration,
        @Schema(description = "XP awarded for completing", example = "50") Integer xp
    ) {}

    public record LessonDto(
        @Schema(description = "Lesson id", example = "1") String id,
        @Schema(description = "Unit id", example = "unit-1") String unitId,
        @Schema(description = "Lesson level", example = "A1") String level,
        @Schema(description = "Lesson skill", example = "speaking") String skill,
        @Schema(description = "Lesson title", example = "Greetings and Introductions") String title,
        @Schema(description = "Short lesson summary") String description,
        @Schema(description = "Estimated duration in minutes") Integer duration,
        @Schema(description = "XP awarded for completing") Integer xp,
        @Schema(description = "Vocabulary items list") List<Map<String, Object>> vocab,
        @Schema(description = "Grammar rule explanation") String grammarRule,
        @Schema(description = "Grammar examples list") List<Map<String, Object>> grammarExamples,
        @Schema(description = "Reading passage text if applicable") String passage,
        @Schema(description = "Listening audio script if applicable") String script,
        @Schema(description = "Interactive speaking/writing prompt") String prompt,
        @Schema(description = "Tips for study") List<String> tips,
        @Schema(description = "Interactive practice questions list") List<Map<String, Object>> questions
    ) {}

    public record QuizResponseDto(
        @Schema(description = "Lesson id", example = "1") String lessonId,
        @Schema(description = "Practice questions") List<Map<String, Object>> questions
    ) {}
}
