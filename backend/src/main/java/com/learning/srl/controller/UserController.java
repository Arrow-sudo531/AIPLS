package com.learning.srl.controller;

import com.learning.srl.dto.UserDto;
import com.learning.srl.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping
    public ResponseEntity<UserDto> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserDto dto) {
        return ResponseEntity.ok(userService.updateUserProfile(userId, dto));
    }
}
