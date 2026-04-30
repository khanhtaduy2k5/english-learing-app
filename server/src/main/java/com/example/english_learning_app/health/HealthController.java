package com.example.english_learning_app.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "Application health and readiness endpoints")
public class HealthController {

  private final HealthService healthService;

  public HealthController(HealthService healthService) {
    this.healthService = healthService;
  }

  @GetMapping("/health")
  @Operation(summary = "Health check", description = "Return a simple ok response for monitoring and docker checks")
  public HealthResponse health() {
    return healthService.health();
  }

  public record HealthResponse(
      @Schema(description = "Health status", example = "ok") String status) {}
}
