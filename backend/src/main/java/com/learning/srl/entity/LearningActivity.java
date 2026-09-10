package com.learning.srl.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Goal goal;

    @Column(nullable = false)
    private LocalDate activityDate;

    private String subject;
    private String task;
    
    @Column(nullable = false)
    private Integer duration;

    private Integer difficultyRating; 
    private Integer distractionCount;
    private String studyMethod;

    private String completionStatus;

    private LocalDateTime loggedAt = LocalDateTime.now();
}
