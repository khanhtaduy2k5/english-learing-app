package com.example.english_learning_app.auth;

import com.example.english_learning_app.user.User;
import com.example.english_learning_app.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final StringRedisTemplate redisTemplate;
  private final SecretKey key;
  private final long accessExpiration;
  private final long refreshExpiration;

  public AuthService(UserRepository userRepository, 
                     PasswordEncoder passwordEncoder,
                     StringRedisTemplate redisTemplate,
                     @Value("${jwt.secret:defaultSecretKeyWithAtLeast32CharactersForTesting123}") String secret,
                     @Value("${jwt.expiration:900000}") long accessExpiration, // default 15 minutes
                     @Value("${jwt.refreshExpiration:604800000}") long refreshExpiration) { // default 7 days
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.redisTemplate = redisTemplate;
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessExpiration = accessExpiration;
    this.refreshExpiration = refreshExpiration;
  }

  public record TokenPair(String accessToken, String refreshToken, AuthController.UserDto user) {}

  public TokenPair login(String email, String password) {
    var user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    
    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    return generateTokenPair(user);
  }

  public TokenPair register(String name, String email, String password) {
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }
    
    if (password == null || password.length() < 8) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
    }

    User user = new User(name, email, passwordEncoder.encode(password));
    user = userRepository.save(user);
    
    return generateTokenPair(user);
  }

  public TokenPair refresh(String refreshToken) {
    if (refreshToken == null || refreshToken.isBlank()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
    }

    try {
      Claims claims = Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(refreshToken)
          .getPayload();

      String userId = claims.getSubject();
      String jti = claims.getId(); // Token ID

      if (userId == null || jti == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token payload");
      }

      String redisKey = "refresh_token:user:" + userId;
      String activeTokenId = redisTemplate != null ? redisTemplate.opsForValue().get(redisKey) : null;

      if (activeTokenId == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired or revoked");
      }

      // Check for Replay Attack: if tokenId doesn't match activeTokenId, it means this token was already used!
      if (!jti.equals(activeTokenId)) {
        if (redisTemplate != null) {
          redisTemplate.delete(redisKey); // Revoke all sessions for safety
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has been rotated (Replay Attack Detected)");
      }

      var user = userRepository.findById(userId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

      return generateTokenPair(user);

    } catch (Exception e) {
      if (e instanceof ResponseStatusException) {
        throw (ResponseStatusException) e;
      }
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token", e);
    }
  }

  public void logout(String refreshToken) {
    if (refreshToken == null || refreshToken.isBlank()) {
      return;
    }

    try {
      Claims claims = Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(refreshToken)
          .getPayload();

      String userId = claims.getSubject();
      if (userId != null && redisTemplate != null) {
        redisTemplate.delete("refresh_token:user:" + userId);
      }
    } catch (Exception e) {
      // Ignore exception on logout parsing
    }
  }

  private TokenPair generateTokenPair(User user) {
    String accessToken = generateAccessToken(user);
    String tokenId = UUID.randomUUID().toString();
    String refreshToken = generateRefreshToken(user, tokenId);

    // Save active Refresh Token in Redis with TTL
    if (redisTemplate != null) {
      String redisKey = "refresh_token:user:" + user.getId();
      redisTemplate.opsForValue().set(redisKey, tokenId, refreshExpiration, TimeUnit.MILLISECONDS);
    }

    var userDto = new AuthController.UserDto(user.getId(), user.getEmail(), user.getName());
    return new TokenPair(accessToken, refreshToken, userDto);
  }

  private String generateAccessToken(User user) {
    return Jwts.builder()
        .subject(user.getId())
        .claim("email", user.getEmail())
        .claim("role", "USER")
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + accessExpiration))
        .signWith(key)
        .compact();
  }

  private String generateRefreshToken(User user, String tokenId) {
    return Jwts.builder()
        .subject(user.getId())
        .id(tokenId) // JWT ID
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
        .signWith(key)
        .compact();
  }
}