package com.example.english_learning_app.config;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RateLimitInterceptorTest {

    @Test
    void preHandle_deniesWhenRedisUnavailable() throws Exception {
        RateLimitInterceptor interceptor = new RateLimitInterceptor(null);
        HttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        boolean allowed = interceptor.preHandle(request, response, new Object());

        assertFalse(allowed);
        assertTrue(response.getContentAsString().contains("Rate limit service unavailable"));
        org.junit.jupiter.api.Assertions.assertEquals(503, response.getStatus());
    }

    @Test
    @SuppressWarnings("unchecked")
    void preHandle_usesRemoteAddrInsteadOfForwardedHeader() throws Exception {
        StringRedisTemplate redisTemplate = mock(StringRedisTemplate.class);
        when(redisTemplate.execute(
            any(org.springframework.data.redis.core.script.RedisScript.class),
            eq(java.util.Collections.singletonList("rate_limit:ip:203.0.113.10")),
            eq("60")
        )).thenReturn(1L);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("203.0.113.10");
        request.addHeader("X-Forwarded-For", "198.51.100.50");
        MockHttpServletResponse response = new MockHttpServletResponse();

        RateLimitInterceptor interceptor = new RateLimitInterceptor(redisTemplate);
        boolean allowed = interceptor.preHandle(request, response, new Object());

        assertTrue(allowed);
        org.mockito.Mockito.verify(redisTemplate).execute(
            any(org.springframework.data.redis.core.script.RedisScript.class),
            eq(java.util.Collections.singletonList("rate_limit:ip:203.0.113.10")),
            eq("60")
        );
    }

    @Test
    @SuppressWarnings("unchecked")
    void preHandle_deniesWhenIncrementReturnsNull() throws Exception {
        StringRedisTemplate redisTemplate = mock(StringRedisTemplate.class);
        when(redisTemplate.execute(
            any(org.springframework.data.redis.core.script.RedisScript.class),
            any(java.util.List.class),
            any()
        )).thenReturn(null);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("203.0.113.10");
        MockHttpServletResponse response = new MockHttpServletResponse();

        RateLimitInterceptor interceptor = new RateLimitInterceptor(redisTemplate);
        boolean allowed = interceptor.preHandle(request, response, new Object());

        assertFalse(allowed);
        org.junit.jupiter.api.Assertions.assertEquals(503, response.getStatus());
        assertTrue(response.getContentAsString().contains("Rate limit service unavailable"));
    }
}