package com.example.english_learning_app.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

import com.example.english_learning_app.auth.dto.AuthResponse;
import com.example.english_learning_app.auth.dto.LogoutResponse;
import com.example.english_learning_app.auth.dto.UserDto;

class AuthControllerTest {

  private final AuthController authController = new AuthController(null);

  @Test
  void userDtoHoldsAllFields() {
    var dto = new UserDto("user-1", "user@example.com", "Test User");

    assertEquals("user-1", dto.id());
    assertEquals("user@example.com", dto.email());
    assertEquals("Test User", dto.name());
  }

  @Test
  void authResponseContainsTokenAndUser() {
    var user = new UserDto("u1", "e@mail.com", "Name");
    var response = new AuthResponse("my-token", user);

    assertEquals("my-token", response.token());
    assertNotNull(response.user());
    assertEquals("u1", response.user().id());
  }

  @Test
  void logoutResponseContainsMessage() {
    var response = new LogoutResponse("Logged out");

    assertEquals("Logged out", response.message());
  }
}

