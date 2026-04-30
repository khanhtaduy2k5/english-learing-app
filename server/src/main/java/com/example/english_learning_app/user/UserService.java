package com.example.english_learning_app.user;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public List<User> findAll() {
    return userRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
  }

  @Transactional(readOnly = true)
  public User findById(String userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  public User create(String name, String email) {
    ensureEmailAvailable(email, null);

    var user = new User(normalizeName(name), normalizeEmail(email));
    try {
      return userRepository.save(user);
    } catch (DataIntegrityViolationException ex) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists", ex);
    }
  }

  public User update(String userId, String name, String email) {
    var user = findById(userId);
    ensureEmailAvailable(email, userId);

    user.setName(normalizeName(name));
    user.setEmail(normalizeEmail(email));

    try {
      return userRepository.save(user);
    } catch (DataIntegrityViolationException ex) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists", ex);
    }
  }

  public void delete(String userId) {
    var user = findById(userId);
    userRepository.delete(user);
  }

  private void ensureEmailAvailable(String email, String currentUserId) {
    var normalizedEmail = normalizeEmail(email);
    userRepository.findByEmailIgnoreCase(normalizedEmail)
        .filter(existing -> currentUserId == null || !existing.getId().equals(currentUserId))
        .ifPresent(existing -> {
          throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        });
  }

  private String normalizeName(String name) {
    return name.trim();
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}