package com.learning.srl.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "reflections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reflection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private String weekLabel;

    @Column(length = 2000)
    private String whatWentWell;

    @Column(length = 2000)
    private String whatWasDifficult;

    @Column(length = 2000)
    private String whatToChange;

    private Boolean aiSuggestionAccepted;

    @Column(length = 2000)
    private String aiSuggestionSnapshot;

    private LocalDateTime createdAt = LocalDateTime.now();
}
