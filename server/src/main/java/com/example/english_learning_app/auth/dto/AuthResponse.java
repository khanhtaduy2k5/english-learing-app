package com.example.english_learning_app.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthResponse(
    @Schema(description = "JWT token used by the client", example = "demo-token") String token,
    @Schema(description = "Authenticated user profile") UserDto user) {}
