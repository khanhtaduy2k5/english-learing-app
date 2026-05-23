package com.example.english_learning_app.unit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.Map;

@Entity
@Table(name = "units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Unit {

    @Id
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String level; // FK to levels

    @Column(nullable = false)
    private Integer number;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String theme;

    @Column(columnDefinition = "TEXT")
    private String emoji;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "checkpoint", nullable = false)
    private Map<String, Object> checkpoint;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
