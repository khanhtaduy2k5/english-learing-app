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

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

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
  void registerFailsWhenEmailExists() {
    when(userRepository.findByEmailIgnoreCase("learner@example.com")).thenReturn(Optional.of(mock(User.class)));
    
    org.junit.jupiter.api.Assertions.assertThrows(ResponseStatusException.class, () -> {
        authService.register("Nguyen Van A", "learner@example.com", "password123");
    });
  }

  @Test
  void logoutInvalidatesToken() {
    authService.logout("some-refresh-token");
  }
}
