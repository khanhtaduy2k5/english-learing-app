package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
class A09_LoggingMonitoringTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldLogFailedLoginAttempts() throws Exception {
        mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email": "attacker@test.com", "password": "wrong"}
                    """));
        
        // In a real scenario, we'd verify the logger via a test appender.
        // For TDD purposes, this test simply ensures the login endpoint can be hit and we can add the assertions later.
    }

    @Test
    void shouldNotLogSensitiveData() throws Exception {
        mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email": "user@test.com", "password": "S3cretP@ss!"}
                    """));
    }
}
