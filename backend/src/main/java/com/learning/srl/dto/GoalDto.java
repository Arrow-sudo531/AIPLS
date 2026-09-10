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
public class GoalDto {
    private Long id;
    private String title;
    private String subject;
    private Integer targetDuration;
    private String frequency;
    private LocalDateTime deadline;
    private String priority;
    private String status;
    private Integer progressMinutes;
    private String aiBreakdown;
    private LocalDateTime createdAt;
}
