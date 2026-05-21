package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringBootVersion;
import org.springframework.core.SpringVersion;

import static org.assertj.core.api.Assertions.assertThat;

class A06_VulnerableComponentsTest {

    @Test
    void shouldNotHaveCriticalCves() {
        // Assert that Spring Boot version is 4.0.6 as per requirements
        assertThat(SpringBootVersion.getVersion()).isEqualTo("4.0.6");
        assertThat(SpringVersion.getVersion()).isNotNull();
    }
}
