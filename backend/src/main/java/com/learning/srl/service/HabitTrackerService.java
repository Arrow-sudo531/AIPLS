package com.learning.srl.service;

import com.learning.srl.dto.LearningActivityDto;
import com.learning.srl.entity.Goal;
import com.learning.srl.entity.LearningActivity;
import com.learning.srl.entity.User;
import com.learning.srl.repository.GoalRepository;
import com.learning.srl.repository.LearningActivityRepository;
import com.learning.srl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitTrackerService {

    private final LearningActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;

    public LearningActivityDto logActivity(Long userId, LearningActivityDto dto, Long goalId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Goal goal = null;
        if (goalId != null) {
            goal = goalRepository.findById(goalId).orElse(null);
        }
        
        LearningActivity activity = LearningActivity.builder()
                .user(user)
                .goal(goal)
                .activityDate(dto.getActivityDate() != null ? dto.getActivityDate() : LocalDate.now())
                .subject(dto.getSubject())
                .task(dto.getTask())
                .duration(dto.getDuration())
                .difficultyRating(dto.getDifficultyRating())
                .distractionCount(dto.getDistractionCount())
                .studyMethod(dto.getStudyMethod())
                .completionStatus(dto.getCompletionStatus())
                .loggedAt(LocalDateTime.now())
                .build();
                
        LearningActivity savedActivity = activityRepository.save(activity);
        
        if (goal != null && "ACTIVE".equals(goal.getStatus()) && goal.getTargetDuration() != null) {
            List<LearningActivity> allActivities = activityRepository.findByUserId(userId);
            final Long currentGoalId = goal.getId();
            
            long totalMinutes = allActivities.stream()
                    .filter(a -> a.getGoal() != null && a.getGoal().getId().equals(currentGoalId))
                    .filter(a -> a.getDuration() != null)
                    .mapToLong(LearningActivity::getDuration)
                    .sum();
                    
            if (totalMinutes >= goal.getTargetDuration()) {
                goal.setStatus("COMPLETED");
                goalRepository.save(goal);
            }
        }
        
        return mapToDto(savedActivity);
    }

    public List<LearningActivityDto> getUserActivitiesForDate(Long userId, LocalDate date) {
        return activityRepository.findByUserIdAndActivityDate(userId, date).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    private LearningActivityDto mapToDto(LearningActivity activity) {
        return LearningActivityDto.builder()
                .id(activity.getId())
                .goalId(activity.getGoal() != null ? activity.getGoal().getId() : null)
                .goalTitle(activity.getGoal() != null ? activity.getGoal().getTitle() : null)
                .activityDate(activity.getActivityDate())
                .subject(activity.getSubject())
                .task(activity.getTask())
                .duration(activity.getDuration())
                .difficultyRating(activity.getDifficultyRating())
                .distractionCount(activity.getDistractionCount())
                .studyMethod(activity.getStudyMethod())
                .completionStatus(activity.getCompletionStatus())
                .loggedAt(activity.getLoggedAt())
                .build();
    }
}
