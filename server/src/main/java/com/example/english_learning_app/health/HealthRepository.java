package com.example.english_learning_app.health;

import org.springframework.stereotype.Repository;

@Repository
public class HealthRepository {

  public String getStatus() {
    return "ok";
  }
}