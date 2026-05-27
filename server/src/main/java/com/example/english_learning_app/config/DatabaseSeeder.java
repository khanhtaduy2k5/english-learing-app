package com.example.english_learning_app.config;

import com.example.english_learning_app.level.Level;
import com.example.english_learning_app.level.LevelRepository;
import com.example.english_learning_app.unit.Unit;
import com.example.english_learning_app.unit.UnitRepository;
import com.example.english_learning_app.lesson.Lesson;
import com.example.english_learning_app.lesson.LessonRepository;
import com.example.english_learning_app.lesson.details.GrammarDetails;
import com.example.english_learning_app.lesson.details.ReadingDetails;
import com.example.english_learning_app.lesson.vocab.Vocabulary;
import com.example.english_learning_app.lesson.vocab.VocabularyRepository;
import com.example.english_learning_app.lesson.vocab.LessonVocabulary;
import com.example.english_learning_app.lesson.quiz.Question;
import com.example.english_learning_app.lesson.quiz.QuestionOption;
import com.example.english_learning_app.lesson.tip.LessonTip;
import com.example.english_learning_app.grammar.GrammarRule;
import com.example.english_learning_app.grammar.GrammarRuleRepository;
import com.example.english_learning_app.localization.LocalizedTranslation;
import com.example.english_learning_app.localization.LocalizedTranslationRepository;
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
    private final LessonRepository lessonRepository;
    private final VocabularyRepository vocabularyRepository;
    private final GrammarRuleRepository grammarRuleRepository;
    private final LocalizedTranslationRepository translationRepository;
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

        // 3. SEED VOCABULARIES (shared pool)
        log.info("Seeding Vocabulary pool...");
        Vocabulary hello = vocabularyRepository.save(new Vocabulary("v-1", "hello", "/həˈloʊ/", "exclamation"));
        Vocabulary friend = vocabularyRepository.save(new Vocabulary("v-2", "friend", "/frend/", "noun"));
        Vocabulary morning = vocabularyRepository.save(new Vocabulary("v-3", "morning", "/ˈmɔːrnɪŋ/", "noun"));
        Vocabulary busy = vocabularyRepository.save(new Vocabulary("v-4", "busy", "/ˈbɪzi/", "adjective"));
        Vocabulary travel = vocabularyRepository.save(new Vocabulary("v-5", "travel", "/ˈtrævl/", "verb"));
        Vocabulary destination = vocabularyRepository.save(new Vocabulary("v-6", "destination", "/ˌdestɪˈneɪʃn/", "noun"));

        // 4. SEED LESSONS
        log.info("Seeding Lessons...");

        // Lesson 1 (A1 - Unit 1 - Grammar)
        Lesson lesson1 = new Lesson();
        lesson1.setId("lesson-1");
        lesson1.setUnitId("unit-1");
        lesson1.setLevel("A1");
        lesson1.setSkill("grammar");
        lesson1.setTitle("Welcome & Introductions");
        lesson1.setDescription("Master basic greetings like hello, goodbye, and how to introduce yourself.");
        lesson1.setDuration(10);
        lesson1.setXp(50);
        lesson1.setCreatedAt(OffsetDateTime.now());

        // Lesson 1 details (Grammar)
        GrammarDetails gDetails = new GrammarDetails();
        gDetails.setId("gd-1");
        gDetails.setLesson(lesson1);
        gDetails.setGrammarRule("To introduce yourself: 'My name is [Name]' or 'I am [Name]'. To greet: 'Hello!', 'Hi!'");
        
        List<Object> examples = objectMapper.readValue(
            "[{\"en\":\"Hello! My name is John.\",\"vi\":\"Xin chào! Tên của tôi là John.\"},{\"en\":\"Nice to meet you.\",\"vi\":\"Rất vui được gặp bạn.\"}]",
            new TypeReference<List<Object>>() {}
        );
        gDetails.setGrammarExamples(examples);
        lesson1.setGrammarDetails(gDetails);

        // Lesson 1 vocab
        LessonVocabulary lv1 = new LessonVocabulary("lv-1", lesson1, hello, "used as a greeting when you meet someone.", "Hello! How are you?", "Xin chào! Bạn khỏe không?", 0);
        LessonVocabulary lv2 = new LessonVocabulary("lv-2", lesson1, friend, "a person whom one knows and with whom one has a bond of mutual affection.", "She is my best friend.", "Cô ấy là bạn thân nhất của tôi.", 1);
        lesson1.setLessonVocabularies(Arrays.asList(lv1, lv2));

        // Lesson 1 tips
        LessonTip tip1 = new LessonTip("lt-1", lesson1, "Always smile when greeting someone! It makes you friendly.", 0);
        lesson1.setTips(Collections.singletonList(tip1));

        // Lesson 1 questions
        Question q1 = new Question();
        q1.setId("q-1");
        q1.setLesson(lesson1);
        q1.setType("multiple_choice");
        q1.setOrderIndex(0);

        QuestionOption qo1 = new QuestionOption("qo-1", q1, "friend", false);
        QuestionOption qo2 = new QuestionOption("qo-2", q1, "name", true);
        QuestionOption qo3 = new QuestionOption("qo-3", q1, "hello", false);
        q1.setOptions(Arrays.asList(qo1, qo2, qo3));
        lesson1.setQuestions(Collections.singletonList(q1));

        // Save Lesson 1 (cascaded)
        lessonRepository.save(lesson1);

        // Seed translations for Question 1
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-1", "text", "en", "Complete: 'Hi! My _____ is Alice.'"));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-1", "text", "vi", "Hoàn thành: 'Hi! My _____ is Alice.'"));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-1", "explanation", "en", "We use 'name' to introduce our name."));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-1", "explanation", "vi", "Chúng ta dùng từ 'name' để giới thiệu tên."));


        // Lesson 2 (A2 - Unit 2 - Reading)
        Lesson lesson2 = new Lesson();
        lesson2.setId("lesson-2");
        lesson2.setUnitId("unit-2");
        lesson2.setLevel("A2");
        lesson2.setSkill("reading");
        lesson2.setTitle("A Busy Day");
        lesson2.setDescription("Read a story about Sarah's busy daily routine.");
        lesson2.setDuration(12);
        lesson2.setXp(60);
        lesson2.setCreatedAt(OffsetDateTime.now());

        // Lesson 2 details (Reading)
        ReadingDetails rDetails = new ReadingDetails();
        rDetails.setId("rd-2");
        rDetails.setLesson(lesson2);
        rDetails.setPassage("Sarah gets up early every morning. She makes breakfast and then takes the bus to work. She is very busy all day, but she loves her job.");
        lesson2.setReadingDetails(rDetails);

        // Lesson 2 vocab
        LessonVocabulary lv3 = new LessonVocabulary("lv-3", lesson2, morning, "the period of time between midnight and noon.", "I walk every morning.", "Tôi đi bộ mỗi sáng.", 0);
        LessonVocabulary lv4 = new LessonVocabulary("lv-4", lesson2, busy, "having a great deal to do.", "He is busy with work.", "Anh ấy bận rộn với công việc.", 1);
        lesson2.setLessonVocabularies(Arrays.asList(lv3, lv4));

        // Lesson 2 questions
        Question q2 = new Question();
        q2.setId("q-2");
        q2.setLesson(lesson2);
        q2.setType("multiple_choice");
        q2.setOrderIndex(0);

        QuestionOption qo4 = new QuestionOption("qo-4", q2, "By taxi", false);
        QuestionOption qo5 = new QuestionOption("qo-5", q2, "By bus", true);
        QuestionOption qo6 = new QuestionOption("qo-6", q2, "On foot", false);
        q2.setOptions(Arrays.asList(qo4, qo5, qo6));
        lesson2.setQuestions(Collections.singletonList(q2));

        // Save Lesson 2 (cascaded)
        lessonRepository.save(lesson2);

        // Seed translations for Question 2
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-2", "text", "en", "How does Sarah go to work?"));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-2", "text", "vi", "Sarah đi làm bằng phương tiện gì?"));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-2", "explanation", "en", "The passage states: 'takes the bus to work'."));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-2", "explanation", "vi", "Đoạn văn ghi rõ: 'takes the bus to work' (bắt xe bus đi làm)."));


        // Lesson 3 (B1 - Unit 3 - Grammar)
        Lesson lesson3 = new Lesson();
        lesson3.setId("lesson-3");
        lesson3.setUnitId("unit-3");
        lesson3.setLevel("B1");
        lesson3.setSkill("grammar");
        lesson3.setTitle("Planning a Trip");
        lesson3.setDescription("Talk about future plans, travel arrangements, and decisions already made.");
        lesson3.setDuration(14);
        lesson3.setXp(75);
        lesson3.setCreatedAt(OffsetDateTime.now());

        GrammarDetails gDetails3 = new GrammarDetails();
        gDetails3.setId("gd-3");
        gDetails3.setLesson(lesson3);
        gDetails3.setGrammarRule("Use 'going to' + verb to talk about plans and intentions that are already decided.");

        List<Object> examples3 = objectMapper.readValue(
            "[{\"en\":\"We are going to travel to Da Nang next month.\",\"vi\":\"Chúng tôi sẽ đi du lịch Đà Nẵng vào tháng tới.\"},{\"en\":\"She is going to visit her grandparents this weekend.\",\"vi\":\"Cô ấy sẽ thăm ông bà vào cuối tuần này.\"}]",
            new TypeReference<List<Object>>() {}
        );
        gDetails3.setGrammarExamples(examples3);
        lesson3.setGrammarDetails(gDetails3);

        LessonVocabulary lv5 = new LessonVocabulary("lv-5", lesson3, travel, "to go from one place to another, especially over a long distance.", "We love to travel during the summer.", "Chúng tôi thích đi du lịch vào mùa hè.", 0);
        LessonVocabulary lv6 = new LessonVocabulary("lv-6", lesson3, destination, "the place where someone or something is going.", "Our destination is Da Nang.", "Điểm đến của chúng tôi là Đà Nẵng.", 1);
        lesson3.setLessonVocabularies(Arrays.asList(lv5, lv6));

        LessonTip tip3 = new LessonTip("lt-2", lesson3, "Use 'going to' when you already have a plan. It sounds natural and confident.", 0);
        lesson3.setTips(Collections.singletonList(tip3));

        Question q3 = new Question();
        q3.setId("q-3");
        q3.setLesson(lesson3);
        q3.setType("multiple_choice");
        q3.setOrderIndex(0);

        QuestionOption qo7 = new QuestionOption("qo-7", q3, "travel", true);
        QuestionOption qo8 = new QuestionOption("qo-8", q3, "travels", false);
        QuestionOption qo9 = new QuestionOption("qo-9", q3, "traveling", false);
        q3.setOptions(Arrays.asList(qo7, qo8, qo9));
        lesson3.setQuestions(Collections.singletonList(q3));

        lessonRepository.save(lesson3);

        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-3", "text", "en", "We are going to _____ to Da Nang next month."));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-3", "text", "vi", "Chúng tôi sẽ _____ đi Đà Nẵng vào tháng tới."));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-3", "explanation", "en", "After 'going to', we use the base form of the verb."));
        translationRepository.save(new LocalizedTranslation(UUID.randomUUID().toString(), "question", "q-3", "explanation", "vi", "Sau 'going to', ta dùng động từ nguyên mẫu."));


        // 5. SEED GRAMMAR RULES
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
