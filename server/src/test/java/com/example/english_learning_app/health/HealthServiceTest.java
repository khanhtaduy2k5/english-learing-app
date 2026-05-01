package com.example.english_learning_app.health;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class HealthServiceTest {

  @Test
  void healthReturnsOkStatus() {
    var service = new HealthService(new HealthRepository());

    var response = service.health();

    assertEquals("ok", response.status());
  }
}
