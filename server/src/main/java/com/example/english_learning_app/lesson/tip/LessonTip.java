package com.example.english_learning_app.lesson.tip;

import com.example.english_learning_app.lesson.Lesson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "lesson_tips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonTip {

    @Id
    @Column(nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "tip_text", columnDefinition = "TEXT", nullable = false)
    private String tipText;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}
