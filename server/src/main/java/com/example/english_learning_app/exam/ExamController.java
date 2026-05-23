package com.example.english_learning_app.exam;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@Tag(name = "Exams", description = "Query standardized full exams and quick exams")
@SecurityRequirement(name = "bearerAuth")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    @Operation(summary = "Get exams", description = "Retrieve list of all standardized exams available")
    public List<Exam> getExams() {
        return examService.getAllExams();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get exam by ID", description = "Retrieve single exam detail containing full and quick variants questions")
    public ResponseEntity<Exam> getExam(@PathVariable String id) {
        return examService.getExam(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
