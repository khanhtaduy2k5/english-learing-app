package com.example.english_learning_app.auth;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.example.english_learning_app.auth.dto.AuthRequest;
import com.example.english_learning_app.auth.dto.AuthResponse;
import com.example.english_learning_app.auth.dto.LogoutResponse;
import com.example.english_learning_app.auth.dto.RegisterRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Authentication endpoints for login, registration, and logout")
public class AuthController {

  private static final long REFRESH_TOKEN_MAX_AGE_SECONDS = 604800; // 7 days

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  @Operation(summary = "Login", description = "Return a demo JWT token and user payload for the provided credentials, sets HttpOnly refresh token cookie")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Invalid login request"),
      @ApiResponse(responseCode = "401", description = "Invalid credentials")
  })
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
    var tokenPair = authService.login(request.email(), request.password());
    var cookie = createRefreshTokenCookie(tokenPair.refreshToken(), REFRESH_TOKEN_MAX_AGE_SECONDS);
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse(tokenPair.accessToken(), tokenPair.user()));
  }

  @PostMapping("/register")
  @Operation(summary = "Register", description = "Create a demo account and return a JWT token plus user profile, sets HttpOnly refresh token cookie")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Registration successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "400", description = "Invalid registration request"),
      @ApiResponse(responseCode = "409", description = "Email already in use")
  })
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    var tokenPair = authService.register(request.name(), request.email(), request.password());
    var cookie = createRefreshTokenCookie(tokenPair.refreshToken(), REFRESH_TOKEN_MAX_AGE_SECONDS);
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse(tokenPair.accessToken(), tokenPair.user()));
  }

  @PostMapping("/refresh")
  @Operation(summary = "Refresh Token", description = "Rotate and issue a new Access Token & Refresh Token from the HttpOnly cookie")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Token refreshed successfully", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
      @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
  })
  public ResponseEntity<AuthResponse> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
    var tokenPair = authService.refresh(refreshToken);
    var cookie = createRefreshTokenCookie(tokenPair.refreshToken(), REFRESH_TOKEN_MAX_AGE_SECONDS);
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new AuthResponse(tokenPair.accessToken(), tokenPair.user()));
  }

  @PostMapping("/logout")
  @Operation(summary = "Logout", description = "Invalidate the current session on both client and server (Redis)")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Logout successful", content = @Content(schema = @Schema(implementation = LogoutResponse.class)))
  })
  public ResponseEntity<LogoutResponse> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
    authService.logout(refreshToken);
    var cookie = createRefreshTokenCookie("", 0); // Delete cookie
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new LogoutResponse("Logged out"));
  }

  private ResponseCookie createRefreshTokenCookie(String refreshToken, long maxAgeSeconds) {
    boolean isSecure = false;
    try {
      var attrs = RequestContextHolder.getRequestAttributes();
      if (attrs instanceof ServletRequestAttributes servletAttrs) {
        HttpServletRequest req = servletAttrs.getRequest();
        isSecure = req.isSecure() || "https".equalsIgnoreCase(req.getHeader("X-Forwarded-Proto"));
      }
    } catch (Exception e) {
      // Fallback if called outside HTTP request context
    }

    return ResponseCookie.from("refreshToken", refreshToken)
        .httpOnly(true)
        .secure(isSecure)
        .sameSite("Lax")
        .path("/")
        .maxAge(maxAgeSeconds)
        .build();
  }
}

