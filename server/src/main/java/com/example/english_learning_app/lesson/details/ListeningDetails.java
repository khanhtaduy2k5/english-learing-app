package com.example.english_learning_app.lesson.details;

import com.example.english_learning_app.lesson.Lesson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "lesson_listening_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListeningDetails {

    @Id
    @Column(nullable = false, length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false, unique = true)
    private Lesson lesson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String script;
}
