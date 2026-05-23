package com.example.english_learning_app.exam;

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
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String emoji;

    @Column(columnDefinition = "TEXT")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> variants;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "full_exam", nullable = false)
    private List<Map<String, Object>> fullExam;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "quick_exam", nullable = false)
    private List<Map<String, Object>> quickExam;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
