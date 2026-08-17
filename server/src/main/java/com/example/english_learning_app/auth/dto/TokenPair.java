package com.example.english_learning_app.auth.dto;

public record TokenPair(String accessToken, String refreshToken, UserDto user) {}
