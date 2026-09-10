package com.learning.srl.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learning.srl.dto.GoalDto;
import com.learning.srl.entity.User;
import com.learning.srl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class MlEngineService {

    private final GoalService goalService;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, String> generateReflectionSynthesis(Long userId, int streak, long totalMinutes) {
        Map<String, String> result = new HashMap<>();
        try {
            String url = "http://localhost:5000/analyze_behavior";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            List<GoalDto> goals = goalService.getUserGoals(userId);
            double totalSet = goals.size() > 0 ? goals.size() : 1.0;
            double totalCompleted = goals.stream().filter(g -> g.getProgressMinutes() >= g.getTargetDuration()).count();
            
            double completionRate = totalCompleted / totalSet;
            
            double targetTime = goals.stream().mapToInt(GoalDto::getTargetDuration).sum();
            double timeRatio = targetTime > 0 ? (double) totalMinutes / targetTime : 1.0;
            
            String requestBody = "{\n" +
                    "  \"goal_completion_rate\": " + completionRate + ",\n" +
                    "  \"time_estimation_ratio\": " + timeRatio + ",\n" +
                    "  \"avg_distractions\": 2.0\n" +
                    "}";
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            String response = restTemplate.postForObject(url, entity, String.class);
            
            JsonNode root = objectMapper.readTree(response);
            result.put("persona", root.path("persona").asText());
            result.put("suggestion", root.path("daily_suggestion").asText());
        } catch (Exception e) {
            e.printStackTrace();
            result.put("persona", "Unknown Learner");
            result.put("suggestion", "Our AI clustering engine is currently analyzing your behavioral data. Check back shortly!");
        }
        return result;
    }

    public String generateNudge(Long userId) {
        try {
            String url = "http://localhost:5000/predict_session";
            
            User user = userRepository.findById(userId).orElseThrow();
            List<GoalDto> goals = goalService.getUserGoals(userId);
            
            int plannedDuration = goals.isEmpty() ? 45 : goals.get(0).getTargetDuration();
            String subject = goals.isEmpty() ? (user.getFieldOfStudy() != null ? user.getFieldOfStudy() : "Learning Science") : goals.get(0).getSubject();
            int currentHour = LocalTime.now().getHour();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String requestBody = "{\n" +
                    "  \"planned_duration\": " + plannedDuration + ",\n" +
                    "  \"time_of_day\": " + currentHour + ",\n" +
                    "  \"streak_days\": 3,\n" +
                    "  \"subject\": \"" + subject + "\"\n" +
                    "}";
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            String response = restTemplate.postForObject(url, entity, String.class);
            
            JsonNode root = objectMapper.readTree(response);
            return root.path("nudge").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "You typically study for 45 mins. Consider breaking this into 25-min Pomodoros today.";
        }
    }

    public String generateGoalBreakdown(String title, String subject, int duration) {
        try {
            String url = "http://localhost:5000/generate_breakdown";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String reqTitle = title != null && !title.isEmpty() ? title : "My Goal";
            String reqSubject = subject != null && !subject.isEmpty() ? subject : "Learning Task";
            String requestBody = "{\n" +
                    "  \"title\": \"" + reqTitle + "\",\n" +
                    "  \"subject\": \"" + reqSubject + "\",\n" +
                    "  \"duration\": " + duration + "\n" +
                    "}";
                    
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            String response = restTemplate.postForObject(url, entity, String.class);
            
            JsonNode root = objectMapper.readTree(response);
            return root.path("breakdown").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "[\"0-10m: Prep\", \"10-40m: Study\", \"40-50m: Review\"]";
        }
    }
}
