package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public class AiServiceException extends DomainException {

  public AiServiceException(String message) {
    super(message, HttpStatus.BAD_GATEWAY);
  }

  public AiServiceException(String message, Throwable cause) {
    super(message, HttpStatus.BAD_GATEWAY, cause);
  }

  public AiServiceException(String message, HttpStatus status) {
    super(message, status);
  }

  public AiServiceException(String message, HttpStatus status, Throwable cause) {
    super(message, status, cause);
  }
}
