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

class AuthServiceTest {

  private UserRepository userRepository;
  private AuthService authService;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    authService = new AuthService(userRepository);
  }

  @Test
  void loginCreatesUserWhenEmailIsMissing() {
    when(userRepository.findByEmailIgnoreCase("Student@Example.com")).thenReturn(Optional.empty());
    
    User mockUser = new User("Student", "Student@Example.com");
    when(userRepository.save(any(User.class))).thenReturn(mockUser);

    var response = authService.login("Student@Example.com");

    assertEquals("demo-token", response.token());
    assertEquals("Student@Example.com", response.user().email());
    assertEquals("Student", response.user().name());
    verify(userRepository).save(any(User.class));
  }

  @Test
  void registerTrimsNameAndNormalizesEmail() {
    when(userRepository.findByEmailIgnoreCase("  learner@example.com  ")).thenReturn(Optional.empty());
    
    User mockUser = new User("Nguyen Van A", "learner@example.com");
    when(userRepository.save(any(User.class))).thenReturn(mockUser);

    var response = authService.register("  Nguyen Van A  ", "  learner@example.com  ");

    assertEquals("demo-token", response.token());
    assertEquals("learner@example.com", response.user().email());
    assertEquals("Nguyen Van A", response.user().name());
    verify(userRepository).save(any(User.class));
  }

  @Test
  void logoutReturnsConfirmationMessage() {
    var response = authService.logout();

    assertEquals("Logged out", response.message());
  }
}
