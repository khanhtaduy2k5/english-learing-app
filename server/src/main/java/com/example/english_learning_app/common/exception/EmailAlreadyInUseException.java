package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyInUseException extends DomainException {

  public EmailAlreadyInUseException() {
    super("Email already in use", HttpStatus.CONFLICT);
  }

  public EmailAlreadyInUseException(String message) {
    super(message, HttpStatus.CONFLICT);
  }
}
