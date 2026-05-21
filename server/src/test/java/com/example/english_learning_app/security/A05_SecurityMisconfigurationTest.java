package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class A05_SecurityMisconfigurationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldNotExposeStackTrace_inErrorResponse() throws Exception {
        mockMvc.perform(get("/api/users/nonexistent-id"))
            .andExpect(result -> {
                String body = result.getResponse().getContentAsString();
                assertThat(body).doesNotContain("Exception");
                assertThat(body).doesNotContain("at org.springframework");
                assertThat(body).doesNotContain("Caused by:");
            });
    }

    @Test
    void shouldIncludeSecurityHeaders() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(header().string("X-Content-Type-Options", "nosniff"))
            .andExpect(header().string("X-Frame-Options", "DENY"))
            .andExpect(header().exists("X-XSS-Protection"));
    }

    @Test
    void shouldRejectDefaultCredentials() throws Exception {
        String[][] defaultCreds = {
            {"admin@admin.com", "admin"},
            {"root@root.com", "root"},
            {"test@test.com", "test"}
        };
        for (var cred : defaultCreds) {
            mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"email": "%s", "password": "%s"}
                        """.formatted(cred[0], cred[1])))
                .andExpect(status().isUnauthorized());
        }
    }
}
