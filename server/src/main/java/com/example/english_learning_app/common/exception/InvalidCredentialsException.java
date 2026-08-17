package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends DomainException {

  public InvalidCredentialsException() {
    super("Invalid credentials", HttpStatus.UNAUTHORIZED);
  }

  public InvalidCredentialsException(String message) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
