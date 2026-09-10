package com.learning.srl.service;

import com.learning.srl.dto.ReflectionDto;
import com.learning.srl.entity.Reflection;
import com.learning.srl.entity.User;
import com.learning.srl.repository.ReflectionRepository;
import com.learning.srl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReflectionService {

    private final ReflectionRepository reflectionRepository;
    private final UserRepository userRepository;

    public ReflectionDto saveReflection(Long userId, ReflectionDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String weekLabel = dto.getWeekLabel() != null
                ? dto.getWeekLabel()
                : generateWeekLabel();

        Reflection reflection = Reflection.builder()
                .user(user)
                .weekLabel(weekLabel)
                .whatWentWell(dto.getWhatWentWell())
                .whatWasDifficult(dto.getWhatWasDifficult())
                .whatToChange(dto.getWhatToChange())
                .aiSuggestionAccepted(dto.getAiSuggestionAccepted())
                .aiSuggestionSnapshot(dto.getAiSuggestionSnapshot())
                .createdAt(LocalDateTime.now())
                .build();

        Reflection saved = reflectionRepository.save(reflection);
        return mapToDto(saved);
    }

    public List<ReflectionDto> getReflections(Long userId) {
        return reflectionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String generateWeekLabel() {
        LocalDateTime now = LocalDateTime.now();
        int week = now.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int year = now.get(IsoFields.WEEK_BASED_YEAR);
        return year + "-W" + String.format("%02d", week);
    }

    private ReflectionDto mapToDto(Reflection r) {
        return ReflectionDto.builder()
                .id(r.getId())
                .weekLabel(r.getWeekLabel())
                .whatWentWell(r.getWhatWentWell())
                .whatWasDifficult(r.getWhatWasDifficult())
                .whatToChange(r.getWhatToChange())
                .aiSuggestionAccepted(r.getAiSuggestionAccepted())
                .aiSuggestionSnapshot(r.getAiSuggestionSnapshot())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
