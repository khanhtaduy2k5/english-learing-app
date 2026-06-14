package com.example.english_learning_app.config;

import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Configuration
public class TestRedisConfig {

    @Bean
    @Primary
    @SuppressWarnings("unchecked")
    public StringRedisTemplate stringRedisTemplate() {
        StringRedisTemplate mockTemplate = mock(StringRedisTemplate.class);
        ValueOperations<String, String> mockOps = mock(ValueOperations.class);
        when(mockTemplate.opsForValue()).thenReturn(mockOps);

        java.util.concurrent.ConcurrentHashMap<String, java.util.concurrent.atomic.AtomicLong> counters = new java.util.concurrent.ConcurrentHashMap<>();
        when(mockOps.increment(org.mockito.ArgumentMatchers.anyString())).thenAnswer(invocation -> {
            String key = invocation.getArgument(0);
            return counters.computeIfAbsent(key, k -> new java.util.concurrent.atomic.AtomicLong(0)).incrementAndGet();
        });

        when(mockTemplate.execute(
            org.mockito.ArgumentMatchers.any(org.springframework.data.redis.core.script.RedisScript.class),
            org.mockito.ArgumentMatchers.any(java.util.List.class),
            org.mockito.ArgumentMatchers.any()
        )).thenAnswer(invocation -> {
            java.util.List<String> keys = invocation.getArgument(1);
            String key = keys.get(0);
            return counters.computeIfAbsent(key, k -> new java.util.concurrent.atomic.AtomicLong(0)).incrementAndGet();
        });

        return mockTemplate;
    }
}
