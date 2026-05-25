package com.example.english_learning_app.localization;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TranslationService {

    private final LocalizedTranslationRepository translationRepository;

    public TranslationService(LocalizedTranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
    }

    /**
     * Dịch một trường văn bản cụ thể.
     * Nếu locale là 'en' hoặc không tìm thấy bản dịch, tự động fallback về giá trị mặc định (tiếng Anh).
     */
    public String translate(String entityType, String entityId, String fieldName, String locale, String defaultValue) {
        if (locale == null || locale.isBlank() || "en".equalsIgnoreCase(locale)) {
            return defaultValue;
        }
        
        return translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale(
                entityType, entityId, fieldName, locale)
                .map(LocalizedTranslation::getTranslationText)
                .orElse(defaultValue);
    }
}
