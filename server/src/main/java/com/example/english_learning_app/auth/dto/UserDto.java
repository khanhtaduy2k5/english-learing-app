package com.example.english_learning_app.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserDto(
    @Schema(description = "User identifier", example = "user-1") String id,
    @Schema(description = "User email address", example = "student@example.com") String email,
    @Schema(description = "User display name", example = "Nguyen Van A") String name) {}
