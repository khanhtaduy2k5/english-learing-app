package com.example.english_learning_app.lesson.details;

import com.example.english_learning_app.lesson.Lesson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;

@Entity
@Table(name = "lesson_grammar_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrammarDetails {

    @Id
    @Column(nullable = false, length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false, unique = true)
    private Lesson lesson;

    @Column(name = "grammar_rule", columnDefinition = "TEXT", nullable = false)
    private String grammarRule;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "grammar_examples", nullable = false)
    private List<Object> grammarExamples;
}
