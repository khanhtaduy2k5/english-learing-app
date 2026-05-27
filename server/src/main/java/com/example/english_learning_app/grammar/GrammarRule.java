package com.example.english_learning_app.grammar;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "grammar_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrammarRule {

    @Id
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String level; // FK to levels

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String rule;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<Object> examples;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private List<Object> questions;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
