package com.example.english_learning_app.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.english_learning_app.auth.dto.TokenPair;
import com.example.english_learning_app.auth.dto.UserDto;
import com.example.english_learning_app.common.exception.BadRequestException;
import com.example.english_learning_app.common.exception.DomainException;
import com.example.english_learning_app.common.exception.EmailAlreadyInUseException;
import com.example.english_learning_app.common.exception.InvalidCredentialsException;
import com.example.english_learning_app.common.exception.InvalidTokenException;
import com.example.english_learning_app.common.exception.UserNotFoundException;
import com.example.english_learning_app.user.User;
import com.example.english_learning_app.user.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {

  private static final Logger log = LoggerFactory.getLogger(AuthService.class);
  private static final String DEFAULT_SECRET = "defaultSecretKeyWithAtLeast32CharactersForTesting123";
  private static final String REFRESH_TOKEN_REDIS_PREFIX = "refresh_token:user:";

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final StringRedisTemplate redisTemplate;
  private final SecretKey key;
  private final long accessExpiration;
  private final long refreshExpiration;

  public AuthService(UserRepository userRepository,
                     PasswordEncoder passwordEncoder,
                     StringRedisTemplate redisTemplate,
                     @Value("${jwt.secret}") String secret,
                     @Value("${jwt.expiration:900000}") long accessExpiration,
                     @Value("${jwt.refreshExpiration:604800000}") long refreshExpiration) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.redisTemplate = redisTemplate;
    if (secret == null || secret.trim().isEmpty() || DEFAULT_SECRET.equals(secret)) {
      throw new IllegalStateException("jwt.secret must be configured explicitly. Set JWT_SECRET in environment.");
    }
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessExpiration = accessExpiration;
    this.refreshExpiration = refreshExpiration;
  }

  public TokenPair login(String email, String password) {
    var user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(InvalidCredentialsException::new);

    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new InvalidCredentialsException();
    }

    return generateTokenPair(user);
  }

  public TokenPair register(String name, String email, String password) {
    var normalizedEmail = email.trim().toLowerCase();

    if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
      throw new EmailAlreadyInUseException();
    }

    if (password == null || password.length() < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    User user = new User(name.trim(), normalizedEmail, passwordEncoder.encode(password));
    user = userRepository.save(user);

    return generateTokenPair(user);
  }

  public TokenPair refresh(String refreshToken) {
    if (refreshToken == null || refreshToken.isBlank()) {
      throw new InvalidTokenException("Missing refresh token");
    }

    try {
      Claims claims = Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(refreshToken)
          .getPayload();

      String userId = claims.getSubject();
      String jti = claims.getId();

      if (userId == null || jti == null) {
        throw new InvalidTokenException("Invalid refresh token payload");
      }

      String redisKey = REFRESH_TOKEN_REDIS_PREFIX + userId;
      String activeTokenId = redisTemplate != null ? redisTemplate.opsForValue().get(redisKey) : null;

      if (activeTokenId == null) {
        throw new InvalidTokenException("Session expired or revoked");
      }

      if (!jti.equals(activeTokenId)) {
        if (redisTemplate != null) {
          redisTemplate.delete(redisKey);
        }
        throw new InvalidTokenException("Token has been rotated (Replay Attack Detected)");
      }

      var user = userRepository.findById(userId)
          .orElseThrow(UserNotFoundException::new);

      return generateTokenPair(user);

    } catch (DomainException e) {
      throw e;
    } catch (Exception e) {
      throw new InvalidTokenException("Invalid or expired refresh token", e);
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
        redisTemplate.delete(REFRESH_TOKEN_REDIS_PREFIX + userId);
      }
    } catch (Exception e) {
      log.debug("Failed to parse token during logout: {}", e.getMessage());
    }
  }

  private TokenPair generateTokenPair(User user) {
    String accessToken = generateAccessToken(user);
    String tokenId = UUID.randomUUID().toString();
    String refreshToken = generateRefreshToken(user, tokenId);

    saveRefreshToken(user.getId(), tokenId);

    var userDto = new UserDto(user.getId(), user.getEmail(), user.getName());
    return new TokenPair(accessToken, refreshToken, userDto);
  }

  private void saveRefreshToken(String userId, String tokenId) {
    if (redisTemplate == null) {
      return;
    }

    try {
      String redisKey = REFRESH_TOKEN_REDIS_PREFIX + userId;
      redisTemplate.opsForValue().set(redisKey, tokenId, refreshExpiration, TimeUnit.MILLISECONDS);
    } catch (RuntimeException exception) {
      log.warn("Skipping refresh-token persistence because Redis is unavailable", exception);
    }
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
        .id(tokenId)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
        .signWith(key)
        .compact();
  }
}

