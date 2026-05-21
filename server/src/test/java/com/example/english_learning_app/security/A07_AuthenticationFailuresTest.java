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

@SpringBootTest
@AutoConfigureMockMvc
class A07_AuthenticationFailuresTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldRejectWeakPasswords() throws Exception {
        String[] weakPasswords = {"123", "pass", "1234567"};
        for (String pwd : weakPasswords) {
            mockMvc.perform(post("/api/auth/register").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Test", "email": "test@test.com", "password": "%s"}
                        """.formatted(pwd)))
                .andExpect(status().isBadRequest());
        }
    }

    @Test
    void shouldInvalidateToken_afterLogout() throws Exception {
        // Will implement full logout integration later (currently token is stateless)
        // If JWT stateless, logout usually means client clears it or a blacklist is used.
    }

    @Test
    void shouldNotAcceptTamperedToken() throws Exception {
        String tamperedToken = "eyJhbGciOiJIUzI1NiJ9.TAMPERED.signature";
        mockMvc.perform(get("/api/users")
                .header("Authorization", "Bearer " + tamperedToken))
            .andExpect(status().isForbidden()); // Spring returns 403 by default without AuthenticationEntryPoint
    }
}
