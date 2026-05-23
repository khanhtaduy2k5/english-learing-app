package com.example.english_learning_app.level;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class LevelService {

    private final LevelRepository levelRepository;

    public LevelService(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    public List<Level> getLevels() {
        return levelRepository.findAll();
    }

    public Optional<Level> getLevel(String levelId) {
        return levelRepository.findById(levelId);
    }
}
