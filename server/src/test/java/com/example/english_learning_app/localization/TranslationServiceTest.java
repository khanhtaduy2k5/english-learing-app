package com.example.english_learning_app.localization;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TranslationServiceTest {

    private LocalizedTranslationRepository translationRepository;
    private TranslationService translationService;

    @BeforeEach
    void setUp() {
        translationRepository = mock(LocalizedTranslationRepository.class);
        translationService = new TranslationService(translationRepository);
    }

    @Test
    void translateReturnsRequestedLocaleWhenAvailable() {
        when(translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale("lesson", "1", "title", "vi"))
            .thenReturn(Optional.of(translation("Xin chao")));

        String result = translationService.translate("lesson", "1", "title", "vi", "Hello");

        assertEquals("Xin chao", result);
    }

    @Test
    void translateFallsBackToEnglishBeforeDefaultValue() {
        when(translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale("lesson", "1", "title", "vi"))
            .thenReturn(Optional.empty());
        when(translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale("lesson", "1", "title", "en"))
            .thenReturn(Optional.of(translation("Hello")));

        String result = translationService.translate("lesson", "1", "title", "vi", "Default hello");

        assertEquals("Hello", result);
        verify(translationRepository).findByEntityTypeAndEntityIdAndFieldNameAndLocale("lesson", "1", "title", "en");
    }

    @Test
    void translateFallsBackToDefaultValueWhenNoTranslationExists() {
        when(translationRepository.findByEntityTypeAndEntityIdAndFieldNameAndLocale("lesson", "1", "title", "en"))
            .thenReturn(Optional.empty());

        String result = translationService.translate("lesson", "1", "title", null, "Default hello");

        assertEquals("Default hello", result);
    }

    private LocalizedTranslation translation(String text) {
        return new LocalizedTranslation("tr-1", "lesson", "1", "title", "vi", text);
    }
}
