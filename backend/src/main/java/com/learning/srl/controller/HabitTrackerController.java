package com.learning.srl.controller;

import com.learning.srl.dto.LearningActivityDto;
import com.learning.srl.service.HabitTrackerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/activities")
@RequiredArgsConstructor
public class HabitTrackerController {

    private final HabitTrackerService habitTrackerService;

    @PostMapping
    public ResponseEntity<LearningActivityDto> logActivity(
            @PathVariable Long userId,
            @RequestParam(required = false) Long goalId,
            @RequestBody LearningActivityDto activityDto) {
        return ResponseEntity.ok(habitTrackerService.logActivity(userId, activityDto, goalId));
    }

    @GetMapping
    public ResponseEntity<List<LearningActivityDto>> getActivities(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return ResponseEntity.ok(habitTrackerService.getUserActivitiesForDate(userId, date));
        }
        return ResponseEntity.ok(habitTrackerService.getAllUserActivities(userId));
    }
}
