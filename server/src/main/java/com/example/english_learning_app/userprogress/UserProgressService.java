package com.example.english_learning_app.userprogress;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;

    public UserProgressService(UserProgressRepository userProgressRepository) {
        this.userProgressRepository = userProgressRepository;
    }

    @Transactional(readOnly = true)
    public List<UserProgress> getProgressByUserId(String userId) {
        return userProgressRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<UserProgress> getProgress(String userId, String lessonId) {
        return userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
    }

    public UserProgress saveOrUpdateProgress(String userId, String lessonId, String status, Integer score) {
        Optional<UserProgress> existing = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        UserProgress progress;
        
        if (existing.isPresent()) {
            progress = existing.get();
            progress.setStatus(status);
            if (score != null) {
                progress.setQuizScore(score);
            }
            if ("completed".equalsIgnoreCase(status)) {
                progress.setCompletedAt(OffsetDateTime.now());
            }
        } else {
            progress = new UserProgress();
            progress.setUserId(userId);
            progress.setLessonId(lessonId);
            progress.setStatus(status);
            progress.setQuizScore(score);
            if ("completed".equalsIgnoreCase(status)) {
                progress.setCompletedAt(OffsetDateTime.now());
            }
        }
        
        return userProgressRepository.save(progress);
    }
}
