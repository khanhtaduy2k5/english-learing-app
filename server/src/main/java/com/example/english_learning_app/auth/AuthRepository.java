package com.example.english_learning_app.auth;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

@Repository
public class AuthRepository {

  private final Map<String, AuthUserProfile> usersByEmail = new ConcurrentHashMap<>();

  public Optional<AuthUserProfile> findByEmail(String email) {
    return Optional.ofNullable(usersByEmail.get(normalizeEmail(email)));
  }

  public AuthUserProfile save(String name, String email) {
    var normalizedEmail = normalizeEmail(email);
    var profile = new AuthUserProfile(UUID.randomUUID().toString(), normalizedEmail, name.trim());
    usersByEmail.put(normalizedEmail, profile);
    return profile;
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}