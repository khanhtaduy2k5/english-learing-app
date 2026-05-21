package com.example.english_learning_app.auth;

import com.example.english_learning_app.user.User;
import com.example.english_learning_app.user.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final SecretKey key;
  private final long expiration;

  public AuthService(UserRepository userRepository, 
                     PasswordEncoder passwordEncoder,
                     @Value("${jwt.secret:defaultSecretKeyWithAtLeast32CharactersForTesting123}") String secret,
                     @Value("${jwt.expiration:86400000}") long expiration) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expiration = expiration;
  }

  public AuthController.AuthResponse login(String email, String password) {
    var user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    
    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    return buildResponse(user);
  }

  public AuthController.AuthResponse register(String name, String email, String password) {
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }
    
    if (password == null || password.length() < 8) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
    }

    User user = new User(name, email, passwordEncoder.encode(password));
    user = userRepository.save(user);
    
    return buildResponse(user);
  }

  public AuthController.LogoutResponse logout() {
    return new AuthController.LogoutResponse("Logged out");
  }

  private String generateToken(User user) {
    return Jwts.builder()
        .subject(user.getId())
        .claim("email", user.getEmail())
        .claim("role", "USER")
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(key)
        .compact();
  }

  private AuthController.AuthResponse buildResponse(User user) {
    var userDto = new AuthController.UserDto(user.getId(), user.getEmail(), user.getName());
    return new AuthController.AuthResponse(generateToken(user), userDto);
  }
}