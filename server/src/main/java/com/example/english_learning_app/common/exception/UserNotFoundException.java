package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends DomainException {

  public UserNotFoundException() {
    super("User not found", HttpStatus.NOT_FOUND);
  }

  public UserNotFoundException(String message) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
