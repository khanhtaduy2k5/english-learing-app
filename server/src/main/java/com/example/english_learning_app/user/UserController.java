package com.example.english_learning_app.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Create, read, update, and delete users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  @Operation(summary = "List users", description = "Return all users sorted by name")
  @ApiResponse(responseCode = "200", description = "User list returned")
  public List<UserResponse> listUsers() {
    return userService.findAll().stream()
        .map(UserController::toResponse)
        .toList();
  }

  @GetMapping("/{userId}")
  @Operation(summary = "Get user", description = "Return a single user by id")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "User found", content = @Content(schema = @Schema(implementation = UserResponse.class))),
      @ApiResponse(responseCode = "404", description = "User not found")
  })
  public UserResponse getUser(@PathVariable String userId) {
    return toResponse(userService.findById(userId));
  }

  @PostMapping
  @Operation(summary = "Create user", description = "Create a new user profile")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "User created", content = @Content(schema = @Schema(implementation = UserResponse.class))),
      @ApiResponse(responseCode = "409", description = "Email already exists")
  })
  public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserUpsertRequest request) {
    var user = userService.create(request.name(), request.email());
    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(user));
  }

  @PutMapping("/{userId}")
  @Operation(summary = "Update user", description = "Update an existing user profile")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "User updated", content = @Content(schema = @Schema(implementation = UserResponse.class))),
      @ApiResponse(responseCode = "404", description = "User not found"),
      @ApiResponse(responseCode = "409", description = "Email already exists")
  })
  public UserResponse updateUser(@PathVariable String userId, @Valid @RequestBody UserUpsertRequest request) {
    return toResponse(userService.update(userId, request.name(), request.email()));
  }

  @DeleteMapping("/{userId}")
  @Operation(summary = "Delete user", description = "Remove a user profile by id")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "User deleted"),
      @ApiResponse(responseCode = "404", description = "User not found")
  })
  public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
    userService.delete(userId);
    return ResponseEntity.noContent().build();
  }

  private static UserResponse toResponse(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail());
  }

  public record UserUpsertRequest(
      @NotBlank @Schema(description = "User display name", example = "Nguyen Van A") String name,
      @NotBlank @Email @Schema(description = "User email address", example = "student@example.com") String email) {}

  public record UserResponse(
      @Schema(description = "User identifier", example = "5d9a3c5e-3e15-4f57-9c11-2d5c8e6d1c33") String id,
      @Schema(description = "User display name", example = "Nguyen Van A") String name,
      @Schema(description = "User email address", example = "student@example.com") String email) {}
}