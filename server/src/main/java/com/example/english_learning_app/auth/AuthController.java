package com.example.english_learning_app.auth;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
    return ResponseEntity.ok(buildResponse(request.email(), request.email().split("@")[0]));
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    return ResponseEntity.ok(buildResponse(request.email(), request.name()));
  }

  @PostMapping("/logout")
  public ResponseEntity<Map<String, String>> logout() {
    return ResponseEntity.ok(Map.of("message", "Logged out"));
  }

  private AuthResponse buildResponse(String email, String name) {
    var user = new UserDto("user-1", email, name);
    return new AuthResponse("demo-token", user);
  }

  public record AuthRequest(String email, String password) {}

  public record RegisterRequest(String name, String email, String password) {}

  public record UserDto(String id, String email, String name) {}

  public record AuthResponse(String token, UserDto user) {}
}
