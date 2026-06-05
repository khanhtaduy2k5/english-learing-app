package com.example.english_learning_app.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class AuthControllerTest {

  private final AuthController authController = new AuthController(null);

  @Test
  void userDtoHoldsAllFields() {
    var dto = new AuthController.UserDto("user-1", "user@example.com", "Test User");

    assertEquals("user-1", dto.id());
    assertEquals("user@example.com", dto.email());
    assertEquals("Test User", dto.name());
  }

  @Test
  void authResponseContainsTokenAndUser() {
    var user = new AuthController.UserDto("u1", "e@mail.com", "Name");
    var response = new AuthController.AuthResponse("my-token", user);

    assertEquals("my-token", response.token());
    assertNotNull(response.user());
    assertEquals("u1", response.user().id());
  }

  @Test
  void logoutResponseContainsMessage() {
    var response = new AuthController.LogoutResponse("Logged out");

    assertEquals("Logged out", response.message());
  }
}
