package com.example.english_learning_app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.time.Duration;

@Component
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final StringRedisTemplate redisTemplate;

    private static final org.springframework.data.redis.core.script.RedisScript<Long> RATE_LIMIT_SCRIPT = 
        new org.springframework.data.redis.core.script.DefaultRedisScript<>(
            "local current = redis.call('INCR', KEYS[1]); " +
            "if current == 1 then " +
            "  redis.call('EXPIRE', KEYS[1], ARGV[1]); " +
            "end; " +
            "return current;",
            Long.class
        );

    public RateLimitInterceptor(@org.springframework.beans.factory.annotation.Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (redisTemplate == null) {
            return denyServiceUnavailable(response);
        }

        String ip = request.getRemoteAddr();
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = "unknown";
        }

        String redisKey = "rate_limit:ip:" + ip;
        try {
            Long count = redisTemplate.execute(
                RATE_LIMIT_SCRIPT,
                java.util.Collections.singletonList(redisKey),
                "60"
            );
            if (count == null) {
                log.warn("Redis rate limiter returned null count for IP: {}", ip);
                return denyServiceUnavailable(response);
            }
            if (count > 100) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests");
                return false;
            }
        } catch (DataAccessException e) {
            log.warn("Redis rate limiter unavailable, denying request. Error: {}", e.getMessage());
            return denyServiceUnavailable(response);
        } catch (java.io.IOException e) {
            log.warn("Failed to write rate limit response, denying request. Error: {}", e.getMessage());
            return denyServiceUnavailable(response);
        }
        return true;
    }

    private boolean denyServiceUnavailable(HttpServletResponse response) throws java.io.IOException {
        response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
        response.getWriter().write("Rate limit service unavailable");
        return false;
    }
}
