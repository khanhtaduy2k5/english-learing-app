package com.example.english_learning_app.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class UserTest {

  @Test
  void constructorSetsNameAndEmail() {
    User user = new User("Nguyen Van A", "student@example.com");

    assertEquals("Nguyen Van A", user.getName());
    assertEquals("student@example.com", user.getEmail());
  }

  @Test
  void idIsNullBeforePersist() {
    User user = new User("Test", "test@example.com");

    assertNull(user.getId());
  }

  @Test
  void assignIdGeneratesUuidWhenIdIsNull() {
    User user = new User("Test", "test@example.com");
    // Simulate @PrePersist
    user.assignId();

    assertNotNull(user.getId());
    assertEquals(36, user.getId().length()); // UUID format: 8-4-4-4-12
  }

  @Test
  void assignIdDoesNotOverwriteExistingId() {
    User user = new User("Test", "test@example.com");
    user.assignId();
    String firstId = user.getId();

    // Call again
    user.assignId();

    assertEquals(firstId, user.getId());
  }

  @Test
  void setNameUpdatesName() {
    User user = new User("Original", "test@example.com");
    user.setName("Updated Name");

    assertEquals("Updated Name", user.getName());
  }

  @Test
  void setEmailUpdatesEmail() {
    User user = new User("Test", "original@example.com");
    user.setEmail("updated@example.com");

    assertEquals("updated@example.com", user.getEmail());
  }
}
