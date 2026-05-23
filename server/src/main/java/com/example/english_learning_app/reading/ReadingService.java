package com.example.english_learning_app.reading;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ReadingService {

    private final ReadingPassageRepository readingPassageRepository;

    public ReadingService(ReadingPassageRepository readingPassageRepository) {
        this.readingPassageRepository = readingPassageRepository;
    }

    public List<ReadingPassage> getAllPassages() {
        return readingPassageRepository.findAll();
    }

    public List<ReadingPassage> getPassagesByLevel(String level) {
        return readingPassageRepository.findByLevel(level);
    }

    public Optional<ReadingPassage> getPassage(String id) {
        return readingPassageRepository.findById(id);
    }
}
