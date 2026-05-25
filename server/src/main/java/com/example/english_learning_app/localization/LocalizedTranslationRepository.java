package com.example.english_learning_app.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocalizedTranslationRepository extends JpaRepository<LocalizedTranslation, String> {
    
    Optional<LocalizedTranslation> findByEntityTypeAndEntityIdAndFieldNameAndLocale(
            String entityType, String entityId, String fieldName, String locale);
            
    List<LocalizedTranslation> findByEntityTypeAndEntityIdAndLocale(
            String entityType, String entityId, String locale);
}
