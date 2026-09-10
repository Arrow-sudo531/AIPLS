package com.learning.srl.service;

import com.learning.srl.dto.UserDto;
import com.learning.srl.entity.User;
import com.learning.srl.repository.GoalRepository;
import com.learning.srl.repository.LearningActivityRepository;
import com.learning.srl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final LearningActivityRepository activityRepository;
    private final ProgressMonitoringService progressMonitoringService;

    public UserDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int totalGoals = goalRepository.findByUserId(userId).size();
        int completedGoals = goalRepository.findByUserIdAndStatus(userId, "COMPLETED").size();
        int activeGoals = goalRepository.findByUserIdAndStatus(userId, "ACTIVE").size();

        long totalMinutes = activityRepository.findByUserId(userId).stream()
                .filter(a -> a.getDuration() != null)
                .mapToLong(a -> a.getDuration())
                .sum();

        int streak = progressMonitoringService.calculateCurrentStreak(userId);

        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .fieldOfStudy(user.getFieldOfStudy())
                .institution(user.getInstitution())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .totalGoals(totalGoals)
                .completedGoals(completedGoals)
                .activeGoals(activeGoals)
                .totalLearningMinutes(totalMinutes)
                .currentStreak(streak)
                .build();
    }

    public UserDto updateUserProfile(Long userId, UserDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null && !dto.getName().isBlank()) user.setName(dto.getName());
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) user.setEmail(dto.getEmail());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getFieldOfStudy() != null) user.setFieldOfStudy(dto.getFieldOfStudy());
        if (dto.getInstitution() != null) user.setInstitution(dto.getInstitution());
        if (dto.getProfilePicture() != null) user.setProfilePicture(dto.getProfilePicture());

        userRepository.save(user);
        return getUserProfile(userId);
    }
}
