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
        String targetLocale = (locale == null || locale.isBlank()) ? "en" : locale;
        
        // 1. Try to find the translation for the requested locale
        java.util.Optional<LocalizedTranslation> translationOpt = translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale(
                entityType, entityId, fieldName, targetLocale);
        
        if (translationOpt.isPresent()) {
            return translationOpt.get().getTranslationText();
        }
        
        // 2. If the requested locale is not 'en', try to fallback to 'en'
        if (!"en".equalsIgnoreCase(targetLocale)) {
            java.util.Optional<LocalizedTranslation> enTranslationOpt = translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale(
                    entityType, entityId, fieldName, "en");
            if (enTranslationOpt.isPresent()) {
                return enTranslationOpt.get().getTranslationText();
            }
        }
        
        // 3. Ultimate fallback to the provided defaultValue
        return defaultValue;
    }
}
