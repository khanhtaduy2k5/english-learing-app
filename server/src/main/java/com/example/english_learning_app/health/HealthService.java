package com.example.english_learning_app.health;

import org.springframework.stereotype.Service;

@Service
public class HealthService {

  private final HealthRepository healthRepository;

  public HealthService(HealthRepository healthRepository) {
    this.healthRepository = healthRepository;
  }

  public HealthController.HealthResponse health() {
    return new HealthController.HealthResponse(healthRepository.getStatus());
  }
}