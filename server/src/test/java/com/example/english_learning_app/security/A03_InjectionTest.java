package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
class A03_InjectionTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldPreventSqlInjection_inLoginEmail() throws Exception {
        String maliciousEmail = "' OR '1'='1' --";
        mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email": "%s", "password": "any"}
                    """.formatted(maliciousEmail)))
            .andExpect(status().isBadRequest()); // Ideally should be bad request due to @Email or 401
    }

    @Test
    void shouldPreventSqlInjection_inPathVariable() throws Exception {
        mockMvc.perform(get("/api/users/{id}", "1'; DROP TABLE app_users;--"))
            .andExpect(status().isBadRequest()); // bad request due to UUID format
    }

    @Test
    void shouldRejectXssPayload_inUserName() throws Exception {
        mockMvc.perform(post("/api/auth/register").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name": "<script>alert('xss')</script>", "email": "xss@test.com", "password": "password123"}
                    """))
            // We expect some form of rejection due to our @Pattern validator
            .andExpect(status().isBadRequest());
    }
}
