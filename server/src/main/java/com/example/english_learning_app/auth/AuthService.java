package com.example.english_learning_app.auth;

import com.example.english_learning_app.user.User;
import com.example.english_learning_app.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private static final String DEMO_TOKEN = "demo-token";

  private final UserRepository userRepository;

  public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public AuthController.AuthResponse login(String email) {
    var user = userRepository.findByEmailIgnoreCase(email)
        .orElseGet(() -> {
          User newUser = new User(email.split("@")[0], email);
          return userRepository.save(newUser);
        });
    return buildResponse(user);
  }

  public AuthController.AuthResponse register(String name, String email) {
    var userOptional = userRepository.findByEmailIgnoreCase(email);
    User user;
    if (userOptional.isPresent()) {
      user = userOptional.get();
    } else {
      user = new User(name, email);
      user = userRepository.save(user);
    }
    return buildResponse(user);
  }

  public AuthController.LogoutResponse logout() {
    return new AuthController.LogoutResponse("Logged out");
  }

  private AuthController.AuthResponse buildResponse(User user) {
    var userDto = new AuthController.UserDto(user.getId(), user.getEmail(), user.getName());
    return new AuthController.AuthResponse(DEMO_TOKEN, userDto);
  }
}