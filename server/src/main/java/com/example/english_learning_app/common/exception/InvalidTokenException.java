package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends DomainException {

  public InvalidTokenException(String message) {
    super(message, HttpStatus.UNAUTHORIZED);
  }

  public InvalidTokenException(String message, Throwable cause) {
    super(message, HttpStatus.UNAUTHORIZED, cause);
  }
}
