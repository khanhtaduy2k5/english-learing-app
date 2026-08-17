package com.example.english_learning_app.auth;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.english_learning_app.common.exception.EmailAlreadyInUseException;
import com.example.english_learning_app.common.exception.InvalidCredentialsException;
import com.example.english_learning_app.user.User;
import com.example.english_learning_app.user.UserRepository;

class AuthServiceTest {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;
  private StringRedisTemplate redisTemplate;
  private ValueOperations<String, String> valueOperations;
  private AuthService authService;

  @BeforeEach
  @SuppressWarnings("unchecked")
  void setUp() {
    userRepository = mock(UserRepository.class);
    passwordEncoder = mock(PasswordEncoder.class);
    redisTemplate = mock(StringRedisTemplate.class);
    valueOperations = mock(ValueOperations.class);

    when(redisTemplate.opsForValue()).thenReturn(valueOperations);

    authService = new AuthService(
        userRepository, 
        passwordEncoder, 
        redisTemplate, 
        "supersecretkeythatisverylong12345678", 
        900000L, 
        604800000L
    );
  }

  @Test
  void loginSucceedsWhenValidCredentials() {
    User mockUser = mock(User.class);
    when(mockUser.getId()).thenReturn("user-1");
    when(mockUser.getEmail()).thenReturn("Student@Example.com");
    when(mockUser.getName()).thenReturn("Student");
    when(mockUser.getPassword()).thenReturn("encodedpass");

    when(userRepository.findByEmailIgnoreCase("Student@Example.com")).thenReturn(Optional.of(mockUser));
    when(passwordEncoder.matches("password123", "encodedpass")).thenReturn(true);

    var response = authService.login("Student@Example.com", "password123");

    assertEquals("Student@Example.com", response.user().email());
    assertEquals("Student", response.user().name());
  }

  @Test
  void loginFailsWhenInvalidPassword() {
    User mockUser = mock(User.class);
    when(mockUser.getPassword()).thenReturn("encodedpass");

    when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(mockUser));
    when(passwordEncoder.matches("wrongpass", "encodedpass")).thenReturn(false);

    assertThrows(InvalidCredentialsException.class, () -> {
      authService.login("student@example.com", "wrongpass");
    });
  }

  @Test
  void registerFailsWhenEmailExists() {
    when(userRepository.findByEmailIgnoreCase("learner@example.com")).thenReturn(Optional.of(mock(User.class)));

    assertThrows(EmailAlreadyInUseException.class, () -> {
      authService.register("Nguyen Van A", "learner@example.com", "password123");
    });
  }

  @Test
  void loginDoesNotFailWhenRedisUnavailable() {
    User mockUser = mock(User.class);
    when(mockUser.getId()).thenReturn("user-1");
    when(mockUser.getEmail()).thenReturn("Student@Example.com");
    when(mockUser.getName()).thenReturn("Student");
    when(mockUser.getPassword()).thenReturn("encodedpass");

    when(userRepository.findByEmailIgnoreCase("Student@Example.com")).thenReturn(Optional.of(mockUser));
    when(passwordEncoder.matches("password123", "encodedpass")).thenReturn(true);
    when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("redis down"));

    assertDoesNotThrow(() -> authService.login("Student@Example.com", "password123"));
  }

  @Test
  void registerDoesNotFailWhenRedisUnavailable() {
    User savedUser = mock(User.class);
    when(savedUser.getId()).thenReturn("user-2");
    when(savedUser.getEmail()).thenReturn("learner@example.com");
    when(savedUser.getName()).thenReturn("Learner");

    when(userRepository.findByEmailIgnoreCase("learner@example.com")).thenReturn(Optional.empty());
    when(userRepository.save(any(User.class))).thenReturn(savedUser);
    when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("redis down"));

    assertDoesNotThrow(() -> authService.register("Learner", "learner@example.com", "password123"));
  }

  @Test
  void logoutInvalidatesToken() {
    authService.logout("some-refresh-token");
  }
}

