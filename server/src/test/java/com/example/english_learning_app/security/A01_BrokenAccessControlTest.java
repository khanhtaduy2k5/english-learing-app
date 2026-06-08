package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class A01_BrokenAccessControlTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReject_whenAccessingProtectedEndpointWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isForbidden());
    }

    @Test
    void shouldReject_whenUserAccessesOtherUserProfile() throws Exception {
        mockMvc.perform(get("/api/users/{id}", "other-user-id")
                .with(user("user-a").roles("USER")))
            .andExpect(status().isForbidden()); // Access restricted by SecurityConfig to ROLE_ADMIN
    }

    @Test
    void shouldReject_whenUsingUnallowedHttpMethod() throws Exception {
        mockMvc.perform(delete("/api/wordle/start").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()))
            .andExpect(status().isForbidden()); // Or 403 if auth runs first
    }
}
