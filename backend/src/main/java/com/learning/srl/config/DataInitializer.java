package com.learning.srl.config;

import com.learning.srl.entity.User;
import com.learning.srl.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner loadData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = User.builder()
                        .name("Test Learner")
                        .email("test@example.com")
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(user);
                System.out.println("Created test user with ID: " + user.getId());
            }
        };
    }
}
