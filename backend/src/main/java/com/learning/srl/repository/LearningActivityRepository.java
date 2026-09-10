package com.learning.srl.repository;

import com.learning.srl.entity.LearningActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LearningActivityRepository extends JpaRepository<LearningActivity, Long> {
    List<LearningActivity> findByUserId(Long userId);
    List<LearningActivity> findByUserIdAndActivityDate(Long userId, LocalDate activityDate);
    List<LearningActivity> findByUserIdAndActivityDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    List<LearningActivity> findByGoalId(Long goalId);
}
