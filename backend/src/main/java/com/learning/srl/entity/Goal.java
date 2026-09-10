package com.learning.srl.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private String title;

    private String subject;

    private Integer targetDuration;

    private String frequency;

    private LocalDateTime deadline;

    private String priority;

    private String status;

    @Column(length = 1000)
    private String aiBreakdown;

    private LocalDateTime createdAt = LocalDateTime.now();
}
