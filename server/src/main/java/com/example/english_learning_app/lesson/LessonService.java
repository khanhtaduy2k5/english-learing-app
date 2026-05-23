package com.example.english_learning_app.lesson;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public List<LessonController.LessonSummaryDto> getLessons() {
        return lessonRepository.findAll().stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public List<LessonController.LessonSummaryDto> getLessonsByLevel(String level) {
        return lessonRepository.findByLevel(level).stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public List<LessonController.LessonSummaryDto> getLessonsByUnit(String unitId) {
        return lessonRepository.findByUnitId(unitId).stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public List<LessonController.LessonSummaryDto> getLessonsBySkill(String skill) {
        return lessonRepository.findBySkill(skill).stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public Optional<LessonController.LessonDto> getLesson(String lessonId) {
        return lessonRepository.findById(lessonId)
            .map(lesson -> new LessonController.LessonDto(
                lesson.getId(),
                lesson.getUnitId(),
                lesson.getLevel(),
                lesson.getSkill(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getDuration(),
                lesson.getXp(),
                lesson.getVocab(),
                lesson.getGrammarRule(),
                lesson.getGrammarExamples(),
                lesson.getPassage(),
                lesson.getScript(),
                lesson.getPrompt(),
                lesson.getTips(),
                lesson.getQuestions()
            ));
    }

    public Optional<LessonController.QuizResponseDto> getQuiz(String lessonId) {
        return lessonRepository.findById(lessonId)
            .map(lesson -> new LessonController.QuizResponseDto(
                lesson.getId(),
                lesson.getQuestions()
            ));
    }

    private LessonController.LessonSummaryDto toSummaryDto(Lesson lesson) {
        return new LessonController.LessonSummaryDto(
            lesson.getId(),
            lesson.getUnitId(),
            lesson.getLevel(),
            lesson.getSkill(),
            lesson.getTitle(),
            lesson.getDescription(),
            lesson.getDuration(),
            lesson.getXp()
        );
    }
}