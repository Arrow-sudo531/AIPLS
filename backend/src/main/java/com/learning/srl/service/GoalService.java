package com.learning.srl.service;

import com.learning.srl.dto.GoalDto;
import com.learning.srl.entity.Goal;
import com.learning.srl.entity.LearningActivity;
import com.learning.srl.entity.User;
import com.learning.srl.repository.GoalRepository;
import com.learning.srl.repository.LearningActivityRepository;
import com.learning.srl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final LearningActivityRepository activityRepository;

    public GoalDto createGoal(Long userId, GoalDto goalDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Goal goal = Goal.builder()
                .user(user)
                .title(goalDto.getTitle())
                .subject(goalDto.getSubject())
                .targetDuration(goalDto.getTargetDuration())
                .frequency(goalDto.getFrequency())
                .deadline(goalDto.getDeadline())
                .priority(goalDto.getPriority())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();
                
        Goal savedGoal = goalRepository.save(goal);
        return mapToDto(savedGoal);
    }

    public List<GoalDto> getUserGoals(Long userId) {
        return goalRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    public void deleteGoal(Long userId, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        List<LearningActivity> activities = activityRepository.findByGoalId(goalId);
        for (LearningActivity activity : activities) {
            activity.setGoal(null);
            activityRepository.save(activity);
        }
        
        goalRepository.delete(goal);
    }

    public GoalDto generateBreakdownForGoal(Long userId, Long goalId, MlEngineService mlEngineService) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        String breakdown = mlEngineService.generateGoalBreakdown(goal.getTitle(), goal.getSubject(), goal.getTargetDuration());
        goal.setAiBreakdown(breakdown);
        Goal savedGoal = goalRepository.save(goal);
        return mapToDto(savedGoal);
    }
    
    private GoalDto mapToDto(Goal goal) {
        long progress = 0;
        if (goal.getId() != null) {
            progress = activityRepository.findByGoalId(goal.getId()).stream()
                    .filter(a -> a.getDuration() != null)
                    .mapToLong(LearningActivity::getDuration)
                    .sum();
        }
        
        return GoalDto.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .subject(goal.getSubject())
                .targetDuration(goal.getTargetDuration())
                .frequency(goal.getFrequency())
                .deadline(goal.getDeadline())
                .priority(goal.getPriority())
                .status(goal.getStatus())
                .progressMinutes((int) progress)
                .aiBreakdown(goal.getAiBreakdown())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
