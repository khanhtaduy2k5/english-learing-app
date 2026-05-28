package com.example.english_learning_app.config;

import com.example.english_learning_app.level.Level;
import com.example.english_learning_app.level.LevelRepository;
import com.example.english_learning_app.unit.Unit;
import com.example.english_learning_app.unit.UnitRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final LevelRepository levelRepository;
    private final UnitRepository unitRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting database seeding (Smart Upsert)...");

        // 1. SEED LEVELS
        log.info("Seeding Levels...");
        List<Level> levels = Arrays.asList(
            new Level("A1", "Beginner", "Super basic vocabulary and daily greetings.", OffsetDateTime.now()),
            new Level("A2", "Elementary", "Simple tasks, personal info, and routine activities.", OffsetDateTime.now()),
            new Level("B1", "Intermediate", "Work, school, leisure, and expressing opinions.", OffsetDateTime.now())
        );

        for (Level level : levels) {
            Optional<Level> existingLevelOpt = levelRepository.findById(level.getLevel());
            if (existingLevelOpt.isPresent()) {
                Level existingLevel = existingLevelOpt.get();
                existingLevel.setName(level.getName());
                existingLevel.setDescription(level.getDescription());
                levelRepository.save(existingLevel);
            } else {
                levelRepository.save(level);
            }
        }

        // 2. SEED UNITS
        log.info("Seeding Units...");
        Map<String, Object> checkpointA1 = objectMapper.readValue(
            "{\"title\":\"A1 Checkpoint\",\"questions\":[{\"question\":\"What is your name?\",\"type\":\"multiple_choice\",\"options\":[\"I am John\",\"Yes\",\"Blue\"],\"correctAnswer\":\"I am John\"}]}",
            new TypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> checkpointA2 = objectMapper.readValue(
            "{\"title\":\"A2 Checkpoint\",\"questions\":[{\"question\":\"Where did you go yesterday?\",\"type\":\"multiple_choice\",\"options\":[\"I go home\",\"I went home\",\"I will go home\"],\"correctAnswer\":\"I went home\"}]}",
            new TypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> checkpointB1 = objectMapper.readValue(
            "{\"title\":\"B1 Checkpoint\",\"questions\":[{\"question\":\"If it rains, we _____ stay at home.\",\"type\":\"multiple_choice\",\"options\":[\"would\",\"will\",\"would have\"],\"correctAnswer\":\"will\"}]}",
            new TypeReference<Map<String, Object>>() {}
        );

        List<Unit> units = Arrays.asList(
            new Unit("unit-1", "A1", 1, "Getting Started", "Learn how to greet people and introduce yourself.", "👋", checkpointA1, OffsetDateTime.now()),
            new Unit("unit-2", "A2", 2, "Everyday Routine", "Talk about daily habits, lifestyle and schedules.", "☕", checkpointA2, OffsetDateTime.now()),
            new Unit("unit-3", "B1", 3, "Dream Destinations", "Express your hopes, travel plans and cultural experiences.", "✈️", checkpointB1, OffsetDateTime.now())
        );

        for (Unit unit : units) {
            Optional<Unit> existingUnitOpt = unitRepository.findById(unit.getId());
            if (existingUnitOpt.isPresent()) {
                Unit existingUnit = existingUnitOpt.get();
                existingUnit.setLevel(unit.getLevel());
                existingUnit.setNumber(unit.getNumber());
                existingUnit.setTitle(unit.getTitle());
                existingUnit.setTheme(unit.getTheme());
                existingUnit.setEmoji(unit.getEmoji());
                existingUnit.setCheckpoint(unit.getCheckpoint());
                unitRepository.save(existingUnit);
            } else {
                unitRepository.save(unit);
            }
        }

        log.info("Database seeding successfully completed (Smart Upsert)!");
    }
}
