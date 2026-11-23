package com.learning.srl.controller;

import com.learning.srl.entity.User;
import com.learning.srl.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getName() == null || request.getName().isBlank())
            return ResponseEntity.badRequest().body("Name is required");
        if (request.getEmail() == null || !request.getEmail().contains("@"))
            return ResponseEntity.badRequest().body("Valid email is required");
        if (request.getPassword() == null || request.getPassword().length() < 6)
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");

        if (userRepository.findByEmail(request.getEmail()).isPresent())
            return ResponseEntity.badRequest().body("Email already registered");

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String stored = user.getPassword();
            boolean matches = (stored != null && stored.startsWith("$2a$"))
                    ? passwordEncoder.matches(request.getPassword(), stored)
                    : (stored != null && stored.equals(request.getPassword()));
            if (matches) {
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}

@Data
class RegisterRequest {
    private String name;
    private String email;
    private String password;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

