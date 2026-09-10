package com.learning.srl.controller;

import com.learning.srl.dto.GoalDto;
import com.learning.srl.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final com.learning.srl.service.MlEngineService mlEngineService;

    @PostMapping
    public ResponseEntity<GoalDto> createGoal(@PathVariable Long userId, @RequestBody GoalDto goalDto) {
        return ResponseEntity.ok(goalService.createGoal(userId, goalDto));
    }

    @GetMapping
    public ResponseEntity<List<GoalDto>> getUserGoals(@PathVariable Long userId) {
        return ResponseEntity.ok(goalService.getUserGoals(userId));
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long userId, @PathVariable Long goalId) {
        goalService.deleteGoal(userId, goalId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{goalId}/breakdown")
    public ResponseEntity<GoalDto> generateBreakdown(
            @PathVariable Long userId,
            @PathVariable Long goalId) {
        return ResponseEntity.ok(goalService.generateBreakdownForGoal(userId, goalId, mlEngineService));
    }
}
