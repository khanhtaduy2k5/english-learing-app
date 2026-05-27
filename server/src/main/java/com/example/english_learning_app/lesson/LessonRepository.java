package com.example.english_learning_app.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {
    List<Lesson> findByLevel(String level);
    List<Lesson> findByUnitId(String unitId);
    List<Lesson> findBySkill(String skill);

    @Query("""
        select l.id as id,
               l.unitId as unitId,
               l.level as level,
               l.skill as skill,
               l.title as title,
               l.description as description,
               l.duration as duration,
               l.xp as xp
        from Lesson l
        """)
    List<LessonSummaryProjection> findAllSummaries(Pageable pageable);

    @Query("""
        select l.id as id,
               l.unitId as unitId,
               l.level as level,
               l.skill as skill,
               l.title as title,
               l.description as description,
               l.duration as duration,
               l.xp as xp
        from Lesson l
        where l.level = :level
        """)
    List<LessonSummaryProjection> findSummariesByLevel(String level, Pageable pageable);

    @Query("""
        select l.id as id,
               l.unitId as unitId,
               l.level as level,
               l.skill as skill,
               l.title as title,
               l.description as description,
               l.duration as duration,
               l.xp as xp
        from Lesson l
        where l.unitId = :unitId
        """)
    List<LessonSummaryProjection> findSummariesByUnitId(String unitId, Pageable pageable);

    @Query("""
        select l.id as id,
               l.unitId as unitId,
               l.level as level,
               l.skill as skill,
               l.title as title,
               l.description as description,
               l.duration as duration,
               l.xp as xp
        from Lesson l
        where l.skill = :skill
        """)
    List<LessonSummaryProjection> findSummariesBySkill(String skill, Pageable pageable);

    interface LessonSummaryProjection {
        String getId();
        String getUnitId();
        String getLevel();
        String getSkill();
        String getTitle();
        String getDescription();
        Integer getDuration();
        Integer getXp();
    }
}
