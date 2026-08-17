package com.example.english_learning_app.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class A04_InsecureDesignTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldRateLimit_afterMultipleFailedLogins() throws Exception {
        // Limit is 100 per minute
        for (int i = 0; i < 150; i++) {
            var result = mockMvc.perform(post("/api/auth/login")
                    .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                    .with(request -> { request.setRemoteAddr("10.0.0.1"); return request; })
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"email": "brute@force.com", "password": "wrong"}
                        """))
                .andReturn();
            
            if (result.getResponse().getStatus() == 429) {
                // Rate limit triggered!
                return;
            }
        }
        
        // If it didn't return 429 within the loop, fail the test
        org.junit.jupiter.api.Assertions.fail("Rate limit 429 was not triggered after 150 attempts");
    }

    @Test
    void shouldNotRevealUserExistence_throughErrorMessages() throws Exception {
        var result1 = mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email": "existing@test.com", "password": "wrong"}
                    """))
            .andReturn().getResponse().getContentAsString();

        var result2 = mockMvc.perform(post("/api/auth/login").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email": "nonexistent@test.com", "password": "wrong"}
                    """))
            .andReturn().getResponse().getContentAsString();

        var json1 = result1.replaceAll("\"timestamp\":\"[^\"]+\"", "");
        var json2 = result2.replaceAll("\"timestamp\":\"[^\"]+\"", "");
        assertThat(json1).isEqualTo(json2);
    }
}
