package com.example.english_learning_app.lesson;

import com.example.english_learning_app.lesson.details.ReadingDetails;
import com.example.english_learning_app.lesson.details.ListeningDetails;
import com.example.english_learning_app.lesson.details.GrammarDetails;
import com.example.english_learning_app.lesson.details.WritingSpeakingDetails;
import com.example.english_learning_app.lesson.vocab.LessonVocabulary;
import com.example.english_learning_app.lesson.quiz.Question;
import com.example.english_learning_app.lesson.tip.LessonTip;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.OffsetDateTime;
import java.util.List;

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

    // --- CÁC QUAN HỆ ONE-TO-ONE CHI TIẾT THEO SKILL ---

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ReadingDetails readingDetails;

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ListeningDetails listeningDetails;

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private GrammarDetails grammarDetails;

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private WritingSpeakingDetails writingSpeakingDetails;

    // --- CÁC QUAN HỆ ONE-TO-MANY ĐƯỢC CHUẨN HÓA ---

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<LessonVocabulary> lessonVocabularies;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<Question> questions;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<LessonTip> tips;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
