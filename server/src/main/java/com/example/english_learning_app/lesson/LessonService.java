package com.example.english_learning_app.lesson;

import com.example.english_learning_app.lesson.vocab.LessonVocabulary;
import com.example.english_learning_app.lesson.quiz.Question;
import com.example.english_learning_app.lesson.quiz.QuestionOption;
import com.example.english_learning_app.lesson.tip.LessonTip;
import com.example.english_learning_app.localization.TranslationService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class LessonService {

    private static final Pageable DEFAULT_SUMMARY_PAGE = PageRequest.of(0, 200);

    private final LessonRepository lessonRepository;
    private final TranslationService translationService;

    public LessonService(LessonRepository lessonRepository, TranslationService translationService) {
        this.lessonRepository = lessonRepository;
        this.translationService = translationService;
    }

    public List<LessonController.LessonSummaryDto> getLessons(String locale) {
        return lessonRepository.findAllSummaries(DEFAULT_SUMMARY_PAGE).stream()
            .map(lesson -> toSummaryDto(lesson, locale))
            .toList();
    }

    public List<LessonController.LessonSummaryDto> getLessonsByLevel(String level, String locale) {
        return lessonRepository.findSummariesByLevel(level, DEFAULT_SUMMARY_PAGE).stream()
            .map(lesson -> toSummaryDto(lesson, locale))
            .toList();
    }

    public List<LessonController.LessonSummaryDto> getLessonsByUnit(String unitId, String locale) {
        return lessonRepository.findSummariesByUnitId(unitId, DEFAULT_SUMMARY_PAGE).stream()
            .map(lesson -> toSummaryDto(lesson, locale))
            .toList();
    }

    public List<LessonController.LessonSummaryDto> getLessonsBySkill(String skill, String locale) {
        return lessonRepository.findSummariesBySkill(skill, DEFAULT_SUMMARY_PAGE).stream()
            .map(lesson -> toSummaryDto(lesson, locale))
            .toList();
    }

    public Optional<LessonController.LessonDto> getLesson(String lessonId, String locale) {
        return lessonRepository.findById(lessonId)
            .map(lesson -> new LessonController.LessonDto(
                lesson.getId(),
                lesson.getUnitId(),
                lesson.getLevel(),
                lesson.getSkill(),
                // Dịch title và description
                translationService.translate("lesson", lesson.getId(), "title", locale, lesson.getTitle()),
                translationService.translate("lesson", lesson.getId(), "description", locale, lesson.getDescription()),
                lesson.getDuration(),
                lesson.getXp(),
                // Map từ vựng chuẩn hóa
                mapVocab(lesson.getLessonVocabularies(), locale),
                // Map ngữ pháp
                lesson.getGrammarDetails() != null ? translationService.translate("lesson_grammar", lesson.getGrammarDetails().getId(), "grammar_rule", locale, lesson.getGrammarDetails().getGrammarRule()) : null,
                lesson.getGrammarDetails() != null ? normalizeGrammarExamples(lesson.getGrammarDetails().getGrammarExamples()) : List.of(),
                // Map chi tiết bài đọc (passage)
                lesson.getReadingDetails() != null ? translationService.translate("lesson_reading", lesson.getReadingDetails().getId(), "passage", locale, lesson.getReadingDetails().getPassage()) : null,
                // Map chi tiết bài nghe (script)
                lesson.getListeningDetails() != null ? translationService.translate("lesson_listening", lesson.getListeningDetails().getId(), "script", locale, lesson.getListeningDetails().getScript()) : null,
                // Map chi tiết viết/nói (prompt)
                lesson.getWritingSpeakingDetails() != null ? translationService.translate("lesson_writing_speaking", lesson.getWritingSpeakingDetails().getId(), "prompt", locale, lesson.getWritingSpeakingDetails().getPrompt()) : null,
                // Map các tips học tập
                mapTips(lesson.getTips(), locale),
                // Map các câu hỏi luyện tập
                mapQuestions(lesson.getQuestions(), locale)
            ));
    }

    public Optional<LessonController.QuizResponseDto> getQuiz(String lessonId, String locale) {
        return lessonRepository.findById(lessonId)
            .map(lesson -> new LessonController.QuizResponseDto(
                lesson.getId(),
                mapQuestions(lesson.getQuestions(), locale)
            ));
    }

    // --- CÁC HÀM MAPPING TIỆN ÍCH TƯƠNG THÍCH NGƯỢC ---

    private LessonController.LessonSummaryDto toSummaryDto(LessonRepository.LessonSummaryProjection lesson, String locale) {
        return new LessonController.LessonSummaryDto(
            lesson.getId(),
            lesson.getUnitId(),
            lesson.getLevel(),
            lesson.getSkill(),
            translationService.translate("lesson", lesson.getId(), "title", locale, lesson.getTitle()),
            translationService.translate("lesson", lesson.getId(), "description", locale, lesson.getDescription()),
            lesson.getDuration(),
            lesson.getXp()
        );
    }

    private List<Map<String, Object>> mapVocab(List<LessonVocabulary> lessonVocabs, String locale) {
        if (lessonVocabs == null) return List.of();
        List<Map<String, Object>> list = new ArrayList<>();
        for (LessonVocabulary lv : lessonVocabs) {
            Map<String, Object> map = new HashMap<>();
            map.put("word", lv.getVocabulary().getWord());
            map.put("ipa", lv.getVocabulary().getPhonetic());
            map.put("partOfSpeech", lv.getVocabulary().getPartOfSpeech());
            map.put("example", lv.getExample());
            
            // Dịch nghĩa từ vựng và câu ví dụ động theo locale
            map.put("meaning", translationService.translate("lesson_vocabulary", lv.getId(), "meaning", locale, lv.getMeaning()));
            map.put("exampleMeaning", translationService.translate("lesson_vocabulary", lv.getId(), "example_meaning", locale, lv.getExampleMeaning()));
            
            list.add(map);
        }
        return list;
    }

    private List<String> mapTips(List<LessonTip> tips, String locale) {
        if (tips == null) return List.of();
        return tips.stream()
            .map(tip -> translationService.translate("lesson_tip", tip.getId(), "tip_text", locale, tip.getTipText()))
            .toList();
    }

    private List<Map<String, Object>> normalizeGrammarExamples(List<Object> examples) {
        if (examples == null) return List.of();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object example : examples) {
            if (example instanceof Map<?, ?> mapExample) {
                Map<String, Object> normalized = new HashMap<>();
                mapExample.forEach((key, value) -> normalized.put(String.valueOf(key), value));
                list.add(normalized);
            } else if (example instanceof String text && !text.isBlank()) {
                Map<String, Object> normalized = new HashMap<>();
                normalized.put("english", text);
                normalized.put("vietnamese", "");
                list.add(normalized);
            }
        }
        return list;
    }

    private List<Map<String, Object>> mapQuestions(List<Question> questions, String locale) {
        if (questions == null) return List.of();
        List<Map<String, Object>> list = new ArrayList<>();
        
        for (Question q : questions) {
            Map<String, Object> map = new HashMap<>();
            
            // Client chấp nhận câu hỏi ở key 'question' hoặc 'text'
            String translatedQuestionText = translationService.translate("question", q.getId(), "text", locale, "");
            map.put("question", translatedQuestionText);
            map.put("text", translatedQuestionText);
            
            // Giải thích câu hỏi
            map.put("explanation", translationService.translate("question", q.getId(), "explanation", locale, ""));
            
            // Danh sách các tùy chọn (options) được dịch động
            List<String> options = new ArrayList<>();
            String correctAnswerText = "";
            
            if (q.getOptions() != null) {
                for (QuestionOption opt : q.getOptions()) {
                    String translatedOptText = translationService.translate("question_option", opt.getId(), "option_text", locale, opt.getOptionText());
                    options.add(translatedOptText);
                    if (Boolean.TRUE.equals(opt.getIsCorrect())) {
                        correctAnswerText = translatedOptText;
                    }
                }
            }
            
            map.put("options", options);
            
            // Đáp án (answer) PHẢI là string của option đúng sau khi đã được dịch để client so sánh chính xác!
            map.put("answer", correctAnswerText);
            
            list.add(map);
        }
        return list;
    }
}
