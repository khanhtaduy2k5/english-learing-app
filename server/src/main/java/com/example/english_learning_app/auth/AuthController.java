package com.example.english_learning_app.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }
  @PostMapping("/login")
  @Operation(summary = "Login", description = "Return a demo JWT token and user payload for the provided credentials, sets HttpOnly refresh token cookie")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Invalid login request")
  })
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
    var tokenPair = authService.login(request.email(), request.password());
    var cookie = createRefreshTokenCookie(tokenPair.refreshToken(), 604800); // 7 days
    return ResponseEntity.ok()
        .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse(tokenPair.accessToken(), tokenPair.user()));
  }

  @PostMapping("/register")
  @Operation(summary = "Register", description = "Create a demo account and return a JWT token plus user profile, sets HttpOnly refresh token cookie")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Registration successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Invalid registration request")
  })
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    var tokenPair = authService.register(request.name(), request.email(), request.password());
    var cookie = createRefreshTokenCookie(tokenPair.refreshToken(), 604800); // 7 days
    return ResponseEntity.ok()
        .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse(tokenPair.accessToken(), tokenPair.user()));
  }

  @PostMapping("/refresh")
  @Operation(summary = "Refresh Token", description = "Rotate and issue a new Access Token & Refresh Token from the HttpOnly cookie")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Token refreshed successfully", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
  })
  public ResponseEntity<AuthResponse> refresh(@org.springframework.web.bind.annotation.CookieValue(value = "refreshToken", required = false) String refreshToken) {
    var tokenPair = authService.refresh(refreshToken);
    var cookie = createRefreshTokenCookie(tokenPair.refreshToken(), 604800); // 7 days
    return ResponseEntity.ok()
        .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse(tokenPair.accessToken(), tokenPair.user()));
  }

  @PostMapping("/logout")
  @Operation(summary = "Logout", description = "Invalidate the current session on both client and server (Redis)")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Logout successful", content = @Content(schema = @Schema(implementation = LogoutResponse.class)))
  })
  public ResponseEntity<LogoutResponse> logout(@org.springframework.web.bind.annotation.CookieValue(value = "refreshToken", required = false) String refreshToken) {
    authService.logout(refreshToken);
    var cookie = createRefreshTokenCookie("", 0); // Delete cookie
    return ResponseEntity.ok()
        .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new LogoutResponse("Logged out"));
  }

  private org.springframework.http.ResponseCookie createRefreshTokenCookie(String refreshToken, long maxAgeSeconds) {
    return org.springframework.http.ResponseCookie.from("refreshToken", refreshToken)
        .httpOnly(true)
        .secure(false) // Set to true in prod (HTTPS)
        .sameSite("Lax")
        .path("/")
        .maxAge(maxAgeSeconds)
        .build();
  }

  public record AuthRequest(
      @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Email
      @Schema(description = "User email address", example = "student@example.com") String email,
      @jakarta.validation.constraints.NotBlank
      @Schema(description = "User password", example = "password123") String password) {}

  public record RegisterRequest(
      @NotBlank(message = "Name is required") 
      @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z0-9 ]+$", message = "Invalid characters in name")
      @Schema(description = "Display name", example = "Nguyen Van A") String name,
      @NotBlank(message = "Email is required") 
      @Email(message = "Invalid email format") 
      @Schema(description = "User email address", example = "student@example.com") String email,
      @NotBlank(message = "Password is required")
      @jakarta.validation.constraints.Size(min = 8, message = "Password must be at least 8 characters")
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
