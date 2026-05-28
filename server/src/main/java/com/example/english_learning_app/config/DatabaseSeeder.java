package com.example.english_learning_app.config;

import com.example.english_learning_app.level.Level;
import com.example.english_learning_app.level.LevelRepository;
import com.example.english_learning_app.unit.Unit;
import com.example.english_learning_app.unit.UnitRepository;
import com.example.english_learning_app.grammar.GrammarRule;
import com.example.english_learning_app.grammar.GrammarRuleRepository;
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
    private final GrammarRuleRepository grammarRuleRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (levelRepository.count() > 0) {
            log.info("Database already seeded. Skipping seeder.");
            return;
        }

        log.info("Starting database seeding...");

        // 1. SEED LEVELS
        log.info("Seeding Levels...");
        Level a1 = new Level("A1", "Beginner", "Super basic vocabulary and daily greetings.", OffsetDateTime.now());
        Level a2 = new Level("A2", "Elementary", "Simple tasks, personal info, and routine activities.", OffsetDateTime.now());
        Level b1 = new Level("B1", "Intermediate", "Work, school, leisure, and expressing opinions.", OffsetDateTime.now());
        
        levelRepository.saveAll(Arrays.asList(a1, a2, b1));

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

        Unit unit1 = new Unit("unit-1", "A1", 1, "Getting Started", "Learn how to greet people and introduce yourself.", "👋", checkpointA1, OffsetDateTime.now());
        Unit unit2 = new Unit("unit-2", "A2", 2, "Everyday Routine", "Talk about daily habits, lifestyle and schedules.", "☕", checkpointA2, OffsetDateTime.now());
        Unit unit3 = new Unit("unit-3", "B1", 3, "Dream Destinations", "Express your hopes, travel plans and cultural experiences.", "✈️", checkpointB1, OffsetDateTime.now());

        unitRepository.saveAll(Arrays.asList(unit1, unit2, unit3));

        // 3. SEED GRAMMAR RULES
        log.info("Seeding Grammar Rules...");
        List<Object> grExamples1 = objectMapper.readValue(
            "[{\"en\":\"I play tennis on Sundays.\",\"vi\":\"Tôi chơi tennis vào các ngày Chủ Nhật.\"},{\"en\":\"She works at a bank.\",\"vi\":\"Cô ấy làm việc tại ngân hàng.\"}]",
            new TypeReference<List<Object>>() {}
        );
        List<Object> grQuestions1 = objectMapper.readValue(
            "[{\"question\":\"He _____ (like) chocolate.\",\"options\":[\"like\",\"likes\",\"liking\"],\"correctIndex\":1}]",
            new TypeReference<List<Object>>() {}
        );
        GrammarRule gr1 = new GrammarRule("gr-rule-1", "A1", "Present Simple Tense", 
            "Use the present simple to express habits, general truths, and unchanging situations.",
            grExamples1, grQuestions1, OffsetDateTime.now()
        );

        List<Object> grExamples2 = objectMapper.readValue(
            "[{\"en\":\"We visited Paris last year.\",\"vi\":\"Chúng tôi đã đến thăm Paris năm ngoái.\"},{\"en\":\"She did not call me.\",\"vi\":\"Cô ấy đã không gọi cho tôi.\"}]",
            new TypeReference<List<Object>>() {}
        );
        List<Object> grQuestions2 = objectMapper.readValue(
            "[{\"question\":\"They _____ (go) to the cinema yesterday.\",\"options\":[\"go\",\"went\",\"gone\"],\"correctIndex\":1}]",
            new TypeReference<List<Object>>() {}
        );
        GrammarRule gr2 = new GrammarRule("gr-rule-2", "A2", "Past Simple Tense", 
            "Use the past simple to talk about completed actions in a time before now.",
            grExamples2, grQuestions2, OffsetDateTime.now()
        );

        List<Object> grExamples3 = objectMapper.readValue(
            "[{\"en\":\"If we leave now, we will catch the train.\",\"vi\":\"Nếu chúng ta đi ngay bây giờ, chúng ta sẽ kịp chuyến tàu.\"},{\"en\":\"She will feel better if she rests.\",\"vi\":\"Cô ấy sẽ cảm thấy tốt hơn nếu cô ấy nghỉ ngơi.\"}]",
            new TypeReference<List<Object>>() {}
        );
        List<Object> grQuestions3 = objectMapper.readValue(
            "[{\"question\":\"If it rains, we _____ stay at home.\",\"options\":[\"will\",\"would\",\"gone\"],\"correctIndex\":0}]",
            new TypeReference<List<Object>>() {}
        );
        GrammarRule gr3 = new GrammarRule("gr-rule-3", "B1", "First Conditional", 
            "Use the first conditional to talk about real future possibilities and their likely results.",
            grExamples3, grQuestions3, OffsetDateTime.now()
        );

        grammarRuleRepository.saveAll(Arrays.asList(gr1, gr2, gr3));

        log.info("Database seeding successfully completed!");
    }
}
