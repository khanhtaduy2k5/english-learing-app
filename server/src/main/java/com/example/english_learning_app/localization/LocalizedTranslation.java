package com.example.english_learning_app.localization;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "localized_translations", indexes = {
    @Index(name = "idx_translation_lookup", columnList = "entity_type, entity_id, field_name, locale")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocalizedTranslation {

    @Id
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false, length = 36)
    private String entityId;

    @Column(name = "field_name", nullable = false, length = 50)
    private String fieldName;

    @Column(nullable = false, length = 10)
    private String locale;

    @Column(name = "translation_text", columnDefinition = "TEXT", nullable = false)
    private String translationText;
}
