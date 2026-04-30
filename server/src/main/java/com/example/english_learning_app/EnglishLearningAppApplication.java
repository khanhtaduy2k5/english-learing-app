package com.example.english_learning_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EnglishLearningAppApplication {

	public static void main(String[] args) {
		// If a DATABASE_URL is provided (Heroku/Supabase style), convert it to Spring's datasource properties
		String springDs = System.getenv("SPRING_DATASOURCE_URL");
		String databaseUrl = System.getenv("DATABASE_URL");
		if ((springDs == null || springDs.isBlank()) && databaseUrl != null && !databaseUrl.isBlank()) {
			try {
				java.net.URI uri = new java.net.URI(databaseUrl);
				String userInfo = uri.getUserInfo(); // may be "user:pass"
				String username = null;
				String password = null;
				if (userInfo != null) {
					String[] parts = userInfo.split(":", 2);
					username = parts[0];
					if (parts.length > 1) password = parts[1];
				}
				String host = uri.getHost();
				int port = uri.getPort() == -1 ? 5432 : uri.getPort();
				String path = uri.getPath(); // e.g. "/postgres"
				String dbName = (path != null && path.length() > 0) ? path.substring(1) : "";
				String jdbc = String.format("jdbc:postgresql://%s:%d/%s?sslmode=require", host, port, dbName);

				// Set both env-style and spring.property style so Spring Boot picks them up
				System.setProperty("SPRING_DATASOURCE_URL", jdbc);
				System.setProperty("spring.datasource.url", jdbc);
				if (username != null) {
					System.setProperty("SPRING_DATASOURCE_USERNAME", username);
					System.setProperty("spring.datasource.username", username);
				}
				if (password != null) {
					System.setProperty("SPRING_DATASOURCE_PASSWORD", password);
					System.setProperty("spring.datasource.password", password);
				}
				System.out.println("Converted DATABASE_URL to JDBC: " + jdbc);
			} catch (Exception e) {
				System.err.println("Failed to parse DATABASE_URL: " + e.getMessage());
			}
		}

		SpringApplication.run(EnglishLearningAppApplication.class, args);
	}

}
