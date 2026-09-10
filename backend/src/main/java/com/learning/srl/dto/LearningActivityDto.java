package com.learning.srl.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningActivityDto {
    private Long id;
    private Long goalId;
    private String goalTitle;
    private LocalDate activityDate;
    private String subject;
    private String task;
    private Integer duration;
    
    private Integer difficultyRating; 
    private Integer distractionCount;
    private String studyMethod;
    
    private String completionStatus;
    private LocalDateTime loggedAt;
}
