package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class InvalidWritingInputException extends DomainException {

  public InvalidWritingInputException(String message) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
