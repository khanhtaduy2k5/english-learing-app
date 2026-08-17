package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class AiRateLimitExceededException extends DomainException {

  public AiRateLimitExceededException(String message) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
