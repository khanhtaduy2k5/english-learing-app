package com.example.english_learning_app.publicapi;

public record NewsResponse(
    String title,
    String description,
    String content,
    String url,
    String urlToImage,
    String publishedAt,
    String readability
) {
}
