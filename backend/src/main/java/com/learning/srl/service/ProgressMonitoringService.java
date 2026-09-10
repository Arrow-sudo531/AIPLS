package com.learning.srl.service;

import com.learning.srl.entity.LearningActivity;
import com.learning.srl.repository.LearningActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressMonitoringService {

    private final LearningActivityRepository activityRepository;

    public int calculateCurrentStreak(Long userId) {
        LocalDate currentDate = LocalDate.now();
        int streak = 0;
        
        while (true) {
            List<LearningActivity> activities = activityRepository.findByUserIdAndActivityDate(userId, currentDate);
            
            boolean hasCompletedActivity = activities.stream()
                    .anyMatch(a -> "COMPLETED".equalsIgnoreCase(a.getCompletionStatus()));
                    
            if (hasCompletedActivity) {
                streak++;
                currentDate = currentDate.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }

    public long calculateTotalLearningTime(Long userId) {
        List<LearningActivity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .filter(a -> a.getDuration() != null)
                .mapToLong(LearningActivity::getDuration)
                .sum();
    }
}
