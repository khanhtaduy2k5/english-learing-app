package com.example.english_learning_app.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record LogoutResponse(
    @Schema(description = "Logout result message", example = "Logged out") String message) {}
