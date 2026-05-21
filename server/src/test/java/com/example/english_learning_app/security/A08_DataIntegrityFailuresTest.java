package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.not;

@SpringBootTest
@AutoConfigureMockMvc
class A08_DataIntegrityFailuresTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldIgnoreUnknownFields_inRequestBody() throws Exception {
        mockMvc.perform(post("/api/auth/register").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name": "Test", "email": "testignore@test.com", "password": "Password123!", "role": "ADMIN", "isAdmin": true}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").doesNotExist())
            .andExpect(jsonPath("$.user.role").doesNotExist());
    }

    @Test
    void shouldPreventMassAssignment_forId() throws Exception {
        mockMvc.perform(post("/api/auth/register").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"id": "custom-id-injection", "name": "Test", "email": "mass@test.com", "password": "Password123!"}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.user.id").value(not("custom-id-injection")));
    }

    @Test
    void shouldRejectMalformedJson() throws Exception {
        mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{not valid json}"))
            .andExpect(status().isBadRequest());
    }
}
