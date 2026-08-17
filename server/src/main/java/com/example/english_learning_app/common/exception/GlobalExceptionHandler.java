package com.example.english_learning_app.common.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  public record ErrorResponse(
      int status,
      String error,
      String message,
      Instant timestamp,
      Map<String, String> details
  ) {
    public ErrorResponse(int status, String error, String message) {
      this(status, error, message, Instant.now(), null);
    }

    public ErrorResponse(int status, String error, String message, Map<String, String> details) {
      this(status, error, message, Instant.now(), details);
    }
  }

  @ExceptionHandler(DomainException.class)
  public ResponseEntity<ErrorResponse> handleDomainException(DomainException ex) {
    log.warn("Domain exception caught: {} - {}", ex.getStatus(), ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        ex.getStatus().value(),
        ex.getStatus().getReasonPhrase(),
        ex.getMessage()
    );
    return ResponseEntity.status(ex.getStatus()).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    log.warn("Validation failed: {}", errors);
    ErrorResponse errorResponse = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        HttpStatus.BAD_REQUEST.getReasonPhrase(),
        "Validation failed",
        errors
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(org.springframework.http.converter.HttpMessageNotReadableException ex) {
    log.warn("HttpMessageNotReadableException caught: {}", ex.getMessage());
    ErrorResponse error = new ErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        HttpStatus.BAD_REQUEST.getReasonPhrase(),
        "Malformed JSON request"
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
    log.warn("Response status exception caught: {} - {}", ex.getStatusCode(), ex.getReason());
    ErrorResponse error = new ErrorResponse(
        ex.getStatusCode().value(),
        ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString(),
        ex.getReason()
    );
    return ResponseEntity.status(ex.getStatusCode()).body(error);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleUnhandledException(Exception ex) {
    log.error("Unhandled exception occurred", ex);
    ErrorResponse error = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
        "An unexpected error occurred"
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
