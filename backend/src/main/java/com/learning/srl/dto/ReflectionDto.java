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
public class ReflectionDto {
    private Long id;
    private String weekLabel;
    private String whatWentWell;
    private String whatWasDifficult;
    private String whatToChange;
    private Boolean aiSuggestionAccepted;
    private String aiSuggestionSnapshot;
    private LocalDateTime createdAt;
}
