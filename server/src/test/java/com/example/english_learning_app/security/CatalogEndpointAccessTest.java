package com.example.english_learning_app.security;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.example.english_learning_app.config.JwtAuthenticationFilter;
import com.example.english_learning_app.config.SecurityConfig;
import com.example.english_learning_app.grammar.GrammarController;
import com.example.english_learning_app.grammar.GrammarService;

@WebMvcTest({GrammarController.class})
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class CatalogEndpointAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GrammarService grammarService;

    @Test
    void grammarListIsPubliclyReadable() throws Exception {
        when(grammarService.getAllRules()).thenReturn(List.of());

        mockMvc.perform(get("/api/grammar"))
            .andExpect(status().isOk());
    }
}
