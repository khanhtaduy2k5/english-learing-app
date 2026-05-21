package com.example.english_learning_app.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.english_learning_app.user.User;
import com.example.english_learning_app.user.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

class AuthServiceTest {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;
  private AuthService authService;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    passwordEncoder = mock(PasswordEncoder.class);
    authService = new AuthService(userRepository, passwordEncoder, "supersecretkeythatisverylong12345678", 86400000L);
  }

  @Test
  void loginSucceedsWhenValidCredentials() {
    User mockUser = new User("Student", "Student@Example.com", "encodedpass");
    when(userRepository.findByEmailIgnoreCase("Student@Example.com")).thenReturn(Optional.of(mockUser));
    when(passwordEncoder.matches("password123", "encodedpass")).thenReturn(true);

    var response = authService.login("Student@Example.com", "password123");

    assertEquals("Student@Example.com", response.user().email());
    assertEquals("Student", response.user().name());
  }

  @Test
  void registerFailsWhenEmailExists() {
    when(userRepository.findByEmailIgnoreCase("learner@example.com")).thenReturn(Optional.of(new User("Test", "test@test.com", "pass")));
    
    org.junit.jupiter.api.Assertions.assertThrows(ResponseStatusException.class, () -> {
        authService.register("Nguyen Van A", "learner@example.com", "password123");
    });
  }

  @Test
  void logoutReturnsConfirmationMessage() {
    var response = authService.logout();
    assertEquals("Logged out", response.message());
  }
}
