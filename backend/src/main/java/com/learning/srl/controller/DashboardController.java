package com.learning.srl.controller;

import com.learning.srl.service.ProgressMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProgressMonitoringService progressService;
    private final com.learning.srl.service.MlEngineService mlEngineService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(@PathVariable Long userId) {
        Map<String, Object> summary = new HashMap<>();
        int streak = progressService.calculateCurrentStreak(userId);
        long totalTime = progressService.calculateTotalLearningTime(userId);
        
        summary.put("currentStreak", streak);
        summary.put("totalLearningTimeMinutes", totalTime);
        
        Map<String, String> synthesis = mlEngineService.generateReflectionSynthesis(userId, streak, totalTime);
        summary.put("persona", synthesis.get("persona"));
        summary.put("recommendation", synthesis.get("suggestion"));
        
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/nudge")
    public ResponseEntity<Map<String, Object>> getNudge(@PathVariable Long userId) {
        return ResponseEntity.ok(mlEngineService.generateNudgeDetails(userId));
    }
}
