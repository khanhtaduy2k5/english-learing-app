package com.example.english_learning_app.lesson;

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
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    @Column(nullable = false)
    private String id;

    @Column(name = "unit_id")
    private String unitId; // FK to units

    @Column(nullable = false)
    private String level; // FK to levels

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer duration;

    private Integer xp;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<Map<String, Object>> vocab;

    @Column(name = "grammar_rule", columnDefinition = "TEXT")
    private String grammarRule;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "grammar_examples", nullable = false)
    private List<Map<String, Object>> grammarExamples;

    @Column(columnDefinition = "TEXT")
    private String passage;

    @Column(columnDefinition = "TEXT")
    private String script;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<String> tips;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<Map<String, Object>> questions;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
