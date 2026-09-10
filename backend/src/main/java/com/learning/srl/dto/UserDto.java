package com.learning.srl.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String fieldOfStudy;
    private String institution;
    private String profilePicture;
    private LocalDateTime createdAt;

    private int totalGoals;
    private int completedGoals;
    private int activeGoals;
    private long totalLearningMinutes;
    private int currentStreak;
}
