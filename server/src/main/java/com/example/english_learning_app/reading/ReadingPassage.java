package com.example.english_learning_app.reading;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "reading_passages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReadingPassage {

    @Id
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String level; // FK to levels

    @Column(nullable = false)
    private String title;

    @Column(name = "passage_text", nullable = false, columnDefinition = "TEXT")
    private String passageText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<Map<String, Object>> questions;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
