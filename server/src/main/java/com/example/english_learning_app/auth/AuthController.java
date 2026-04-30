package com.example.english_learning_app.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Authentication endpoints for login, registration, and logout")
public class AuthController {

  @PostMapping("/login")
  @Operation(summary = "Login", description = "Return a demo JWT token and user payload for the provided credentials")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Invalid login request")
  })
  public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
    return ResponseEntity.ok(buildResponse(request.email(), request.email().split("@")[0]));
  }

  @PostMapping("/register")
  @Operation(summary = "Register", description = "Create a demo account and return a JWT token plus user profile")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Registration successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Invalid registration request")
  })
  public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    return ResponseEntity.ok(buildResponse(request.email(), request.name()));
  }

  @PostMapping("/logout")
  @Operation(summary = "Logout", description = "Invalidate the current session on the client side")
  @SecurityRequirement(name = "bearerAuth")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Logout successful", content = @Content(schema = @Schema(implementation = LogoutResponse.class)))
  })
  public ResponseEntity<LogoutResponse> logout() {
    return ResponseEntity.ok(new LogoutResponse("Logged out"));
  }

  private AuthResponse buildResponse(String email, String name) {
    var user = new UserDto("user-1", email, name);
    return new AuthResponse("demo-token", user);
  }

  public record AuthRequest(
      @Schema(description = "User email address", example = "student@example.com") String email,
      @Schema(description = "User password", example = "password123") String password) {}

  public record RegisterRequest(
      @Schema(description = "Display name", example = "Nguyen Van A") String name,
      @Schema(description = "User email address", example = "student@example.com") String email,
      @Schema(description = "User password", example = "password123") String password) {}

  public record UserDto(
      @Schema(description = "User identifier", example = "user-1") String id,
      @Schema(description = "User email address", example = "student@example.com") String email,
      @Schema(description = "User display name", example = "Nguyen Van A") String name) {}

  public record AuthResponse(
      @Schema(description = "JWT token used by the client", example = "demo-token") String token,
      @Schema(description = "Authenticated user profile") UserDto user) {}

  public record LogoutResponse(
      @Schema(description = "Logout result message", example = "Logged out") String message) {}
}
