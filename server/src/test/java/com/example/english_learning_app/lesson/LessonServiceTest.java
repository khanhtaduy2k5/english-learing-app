package com.example.english_learning_app.lesson;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.english_learning_app.lesson.quiz.Question;
import com.example.english_learning_app.lesson.quiz.QuestionOption;
import com.example.english_learning_app.lesson.tip.LessonTip;
import com.example.english_learning_app.localization.TranslationService;

class LessonServiceTest {

    private LessonRepository lessonRepository;
    private TranslationService translationService;
    private LessonService lessonService;

    @BeforeEach
    void setUp() {
        lessonRepository = mock(LessonRepository.class);
        translationService = mock(TranslationService.class);
        lessonService = new LessonService(lessonRepository, translationService);
    }

    @Test
    void getLessonsMapsSummariesWithTranslations() {
        LessonRepository.LessonSummaryProjection lesson = summary("lesson-1");
        when(lessonRepository.findAllSummaries(any())).thenReturn(List.of(lesson));
        when(translationService.translate("lesson", "lesson-1", "title", "vi", "Original title")).thenReturn("Tieu de");
        when(translationService.translate("lesson", "lesson-1", "description", "vi", "Original description")).thenReturn("Mo ta");

        List<LessonController.LessonSummaryDto> result = lessonService.getLessons("vi");

        assertEquals("Tieu de", result.get(0).title());
        assertEquals("Mo ta", result.get(0).description());
    }

    @Test
    void getLessonMapsTipsAndQuestionsWithTranslatedAnswers() {
        Lesson lesson = lesson("lesson-1");
        LessonTip tip = new LessonTip("tip-1", lesson, "Read aloud", 1);
        Question question = new Question("question-1", lesson, "multiple_choice", 1, null);
        QuestionOption correct = new QuestionOption("option-1", question, "Yes", true);
        QuestionOption wrong = new QuestionOption("option-2", question, "No", false);
        question.setOptions(List.of(correct, wrong));
        lesson.setTips(List.of(tip));
        lesson.setQuestions(List.of(question));

        when(lessonRepository.findById("lesson-1")).thenReturn(Optional.of(lesson));
        when(translationService.translate(anyString(), anyString(), anyString(), anyString(), anyString()))
            .thenAnswer(invocation -> invocation.getArgument(4));
        when(translationService.translate("lesson_tip", "tip-1", "tip_text", "vi", "Read aloud")).thenReturn("Doc to");
        when(translationService.translate("question", "question-1", "text", "vi", "")).thenReturn("Cau tra loi la gi?");
        when(translationService.translate("question_option", "option-1", "option_text", "vi", "Yes")).thenReturn("Co");
        when(translationService.translate("question_option", "option-2", "option_text", "vi", "No")).thenReturn("Khong");

        Optional<LessonController.LessonDto> result = lessonService.getLesson("lesson-1", "vi");

        assertTrue(result.isPresent());
        assertEquals("Doc to", result.get().tips().get(0));
        assertEquals("Cau tra loi la gi?", result.get().questions().get(0).get("question"));
        assertEquals("Co", result.get().questions().get(0).get("answer"));
    }

    @Test
    void getQuizReturnsEmptyWhenLessonDoesNotExist() {
        when(lessonRepository.findById("missing")).thenReturn(Optional.empty());

        assertTrue(lessonService.getQuiz("missing", "en").isEmpty());
    }

    private Lesson lesson(String id) {
        return new Lesson(
            id,
            "unit-1",
            "A1",
            "reading",
            "Original title",
            "Original description",
            15,
            50,
            null,
            null,
            null,
            null,
            List.of(),
            List.of(),
            List.of(),
            OffsetDateTime.now()
        );
    }

    private LessonRepository.LessonSummaryProjection summary(String id) {
        return new LessonRepository.LessonSummaryProjection() {
            @Override
            public String getId() {
                return id;
            }

            @Override
            public String getUnitId() {
                return "unit-1";
            }

            @Override
            public String getLevel() {
                return "A1";
            }

            @Override
            public String getSkill() {
                return "reading";
            }

            @Override
            public String getTitle() {
                return "Original title";
            }

            @Override
            public String getDescription() {
                return "Original description";
            }

            @Override
            public Integer getDuration() {
                return 15;
            }

            @Override
            public Integer getXp() {
                return 50;
            }
        };
    }
}
