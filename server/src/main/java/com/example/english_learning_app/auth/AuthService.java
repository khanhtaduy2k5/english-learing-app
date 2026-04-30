package com.example.english_learning_app.auth;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private static final String DEMO_TOKEN = "demo-token";

  private final AuthRepository authRepository;

  public AuthService(AuthRepository authRepository) {
    this.authRepository = authRepository;
  }

  public AuthController.AuthResponse login(String email) {
    var user = authRepository.findByEmail(email)
        .orElseGet(() -> authRepository.save(email.split("@")[0], email));
    return buildResponse(user);
  }

  public AuthController.AuthResponse register(String name, String email) {
    var user = authRepository.save(name, email);
    return buildResponse(user);
  }

  public AuthController.LogoutResponse logout() {
    return new AuthController.LogoutResponse("Logged out");
  }

  private AuthController.AuthResponse buildResponse(AuthUserProfile user) {
    var userDto = new AuthController.UserDto(user.id(), user.email(), user.name());
    return new AuthController.AuthResponse(DEMO_TOKEN, userDto);
  }
}