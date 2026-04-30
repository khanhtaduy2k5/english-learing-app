package com.example.english_learning_app.lesson;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
  @Operation(summary = "List lessons", description = "Return the available lesson summaries for the dashboard")
  @ApiResponse(responseCode = "200", description = "Lesson list returned")
  public List<LessonSummaryDto> getLessons() {
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
      @Schema(description = "Lesson title", example = "Greetings and Introductions") String title,
      @Schema(description = "Short lesson summary", example = "Learn basic greetings and self-introductions.") String description,
      @Schema(description = "Lesson level", example = "Beginner") String level) {}

    public record LessonDto(
      @Schema(description = "Lesson id", example = "1") String id,
      @Schema(description = "Lesson title", example = "Greetings and Introductions") String title,
      @Schema(description = "Short lesson summary", example = "Learn basic greetings and self-introductions.") String description,
      @Schema(description = "Lesson level", example = "Beginner") String level,
      @Schema(description = "Lesson content", example = "Simple dialogues for meeting new people.") String content) {}

    public record QuizResponseDto(
      @Schema(description = "Lesson id", example = "1") String lessonId,
      @Schema(description = "Quiz questions") List<QuizQuestionDto> questions) {}

    public record QuizQuestionDto(
      @Schema(description = "Question id", example = "1-q1") String id,
      @Schema(description = "Quiz question", example = "Which phrase is a greeting?") String question,
      @Schema(description = "Answer options") List<String> options,
      @Schema(description = "Correct answer", example = "Good morning") String answer) {}
}
