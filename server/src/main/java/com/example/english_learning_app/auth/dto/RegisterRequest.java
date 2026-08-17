package com.example.english_learning_app.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z0-9 ]+$", message = "Invalid characters in name")
    @Schema(description = "Display name", example = "Nguyen Van A") 
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User email address", example = "student@example.com") 
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Schema(description = "User password", example = "password123") 
    String password) {}
