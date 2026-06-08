package com.example.english_learning_app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.List;

@Configuration
public class WebConfig {

  @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:5173,https://learnenglish1.me,https://www.learnenglish1.me,http://server:8080}")
  private List<String> allowedOrigins;

  @Bean
  public WebMvcConfigurer corsConfigurer(RateLimitInterceptor rateLimitInterceptor) {
    return new WebMvcConfigurer() {
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(allowedOrigins.toArray(new String[0]))
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
      }

      @Override
      public void addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry registry) {
          registry.addInterceptor(rateLimitInterceptor).addPathPatterns("/api/auth/login", "/api/auth/register");
      }
    };
  }
}
