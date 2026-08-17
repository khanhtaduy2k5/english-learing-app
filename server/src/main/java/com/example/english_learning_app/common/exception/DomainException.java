package com.example.english_learning_app.common.exception;

import org.springframework.http.HttpStatus;

public abstract class DomainException extends RuntimeException {

  private final HttpStatus status;

  protected DomainException(String message, HttpStatus status) {
    super(message);
    this.status = status;
  }

  protected DomainException(String message, HttpStatus status, Throwable cause) {
    super(message, cause);
    this.status = status;
  }

  public HttpStatus getStatus() {
    return status;
  }
}
