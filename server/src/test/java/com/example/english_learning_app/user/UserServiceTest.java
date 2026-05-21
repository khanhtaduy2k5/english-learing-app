package com.example.english_learning_app.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;

class UserServiceTest {

  private UserRepository userRepository;
  private UserService userService;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    userService = new UserService(userRepository);
  }

  @Test
  void findAllReturnsSortedUsers() {
    User user1 = new User("Alice", "alice@example.com", "password");
    User user2 = new User("Bob", "bob@example.com", "password");
    when(userRepository.findAll(any(Sort.class))).thenReturn(Arrays.asList(user1, user2));

    List<User> result = userService.findAll();

    assertEquals(2, result.size());
    assertEquals("Alice", result.get(0).getName());
    verify(userRepository).findAll(any(Sort.class));
  }

  @Test
  void findByIdReturnsUserWhenFound() {
    User user = new User("Test", "test@example.com", "password");
    when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

    User result = userService.findById("user-1");

    assertEquals("Test", result.getName());
  }

  @Test
  void findByIdThrows404WhenNotFound() {
    when(userRepository.findById("unknown")).thenReturn(Optional.empty());

    assertThrows(ResponseStatusException.class, () -> userService.findById("unknown"));
  }

  @Test
  void createSavesNewUser() {
    when(userRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());
    User savedUser = new User("Nguyen Van A", "student@example.com", "password");
    when(userRepository.save(any(User.class))).thenReturn(savedUser);

    User result = userService.create("  Nguyen Van A  ", "  Student@Example.com  ", "password");

    assertNotNull(result);
    assertEquals("Nguyen Van A", result.getName());
    verify(userRepository).save(any(User.class));
  }

  @Test
  void createThrowsConflictWhenEmailAlreadyExists() {
    User existing = new User("Existing", "student@example.com", "password");
    when(userRepository.findByEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(existing));

    assertThrows(ResponseStatusException.class, () -> userService.create("New User", "student@example.com", "password"));
    verify(userRepository, never()).save(any(User.class));
  }

  @Test
  void deleteRemovesUser() {
    User user = new User("Test", "test@example.com", "password");
    when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

    userService.delete("user-1");

    verify(userRepository).delete(user);
  }

  @Test
  void deleteThrows404WhenUserNotFound() {
    when(userRepository.findById("unknown")).thenReturn(Optional.empty());

    assertThrows(ResponseStatusException.class, () -> userService.delete("unknown"));
  }
}
