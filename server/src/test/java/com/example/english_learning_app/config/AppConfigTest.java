package com.example.english_learning_app.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

class AppConfigTest {

    @Test
    void restTemplate_hasTimeoutsConfigured() {
        AppConfig config = new AppConfig();
        RestTemplate restTemplate = config.restTemplate();
        
        assertTrue(restTemplate.getRequestFactory() instanceof SimpleClientHttpRequestFactory);
        SimpleClientHttpRequestFactory factory = (SimpleClientHttpRequestFactory) restTemplate.getRequestFactory();
        
        int connectTimeout = (int) ReflectionTestUtils.getField(factory, "connectTimeout");
        int readTimeout = (int) ReflectionTestUtils.getField(factory, "readTimeout");
        
        assertEquals(5000, connectTimeout);
        assertEquals(30000, readTimeout);
    }
}
