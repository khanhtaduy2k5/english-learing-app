package com.example.english_learning_app.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class UserControllerTest {

  @Test
  void userUpsertRequestRecordHoldsFields() {
    var request = new UserController.UserUpsertRequest("Test User", "test@example.com");

    assertEquals("Test User", request.name());
    assertEquals("test@example.com", request.email());
  }

  @Test
  void userResponseRecordHoldsAllFields() {
    var response = new UserController.UserResponse("id-1", "Jane Doe", "jane@example.com", "http://example.com/avatar.jpg");

    assertEquals("id-1", response.id());
    assertEquals("Jane Doe", response.name());
    assertEquals("jane@example.com", response.email());
    assertEquals("http://example.com/avatar.jpg", response.avatarUrl());
  }

  @Test
  void userResponseFieldsAreNotNull() {
    var response = new UserController.UserResponse("id-1", "Name", "email@test.com", "http://example.com/avatar.jpg");

    assertNotNull(response.id());
    assertNotNull(response.name());
    assertNotNull(response.email());
    assertNotNull(response.avatarUrl());
  }
}
