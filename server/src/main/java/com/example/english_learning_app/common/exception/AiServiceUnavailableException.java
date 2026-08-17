package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class AiServiceUnavailableException extends DomainException {

  public AiServiceUnavailableException(String message) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }

  public AiServiceUnavailableException(String message, Throwable cause) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, cause);
  }
}
