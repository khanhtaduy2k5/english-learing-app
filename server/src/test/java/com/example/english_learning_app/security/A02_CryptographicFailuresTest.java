package com.example.english_learning_app.security;

import com.example.english_learning_app.auth.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class A02_CryptographicFailuresTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void shouldHashPassword_notStorePlaintext() {
        String rawPassword = "MyStr0ng!Pass";
        String stored = passwordEncoder.encode(rawPassword);
        
        assertThat(stored).isNotEqualTo(rawPassword);
        assertThat(passwordEncoder.matches(rawPassword, stored)).isTrue();
    }

    @Test
    void shouldNotExposePasswordInApiResponse() throws Exception {
        // Assume user with ID '1' exists or we just test the structure
        mockMvc.perform(get("/api/users/1")
                .with(user("admin").roles("ADMIN")))
            .andExpect(jsonPath("$.password").doesNotExist())
            .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }
}
