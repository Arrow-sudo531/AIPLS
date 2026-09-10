package com.learning.srl.controller;

import com.learning.srl.dto.ReflectionDto;
import com.learning.srl.service.ReflectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/reflections")
@RequiredArgsConstructor
public class ReflectionController {

    private final ReflectionService reflectionService;

    @PostMapping
    public ResponseEntity<ReflectionDto> saveReflection(
            @PathVariable Long userId,
            @RequestBody ReflectionDto dto) {
        return ResponseEntity.ok(reflectionService.saveReflection(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<ReflectionDto>> getReflections(@PathVariable Long userId) {
        return ResponseEntity.ok(reflectionService.getReflections(userId));
    }
}
