package com.example.english_learning_app.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AuthServiceTest {

  private AuthRepository authRepository;
  private AuthService authService;

  @BeforeEach
  void setUp() {
    authRepository = new AuthRepository();
    authService = new AuthService(authRepository);
  }

  @Test
  void loginCreatesUserWhenEmailIsMissing() {
    var response = authService.login("Student@Example.com");

    assertEquals("demo-token", response.token());
    assertEquals("student@example.com", response.user().email());
    assertEquals("Student", response.user().name());
    assertTrue(authRepository.findByEmail("student@example.com").isPresent());
  }

  @Test
  void registerTrimsNameAndNormalizesEmail() {
    var response = authService.register("  Nguyen Van A  ", "  learner@example.com  ");

    assertEquals("demo-token", response.token());
    assertEquals("learner@example.com", response.user().email());
    assertEquals("Nguyen Van A", response.user().name());
  }

  @Test
  void logoutReturnsConfirmationMessage() {
    var response = authService.logout();

    assertEquals("Logged out", response.message());
  }
}
