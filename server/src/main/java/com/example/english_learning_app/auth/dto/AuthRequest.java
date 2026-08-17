package com.example.english_learning_app.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User email address", example = "student@example.com") 
    String email,

    @NotBlank(message = "Password is required")
    @Schema(description = "User password", example = "password123") 
    String password) {}
