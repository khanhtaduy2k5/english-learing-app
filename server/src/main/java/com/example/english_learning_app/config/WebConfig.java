package com.example.english_learning_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

  @Bean
  public WebMvcConfigurer corsConfigurer(RateLimitInterceptor rateLimitInterceptor) {
    return new WebMvcConfigurer() {
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
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
