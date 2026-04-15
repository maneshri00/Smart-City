package com.smartcity.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@Service
public class AIService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> classifyComplaint(String description, String location) {
        String url = aiServiceUrl + "/ai/classify-complaint";
        Map<String, String> request = new HashMap<>();
        request.put("description", description);
        request.put("location", location);

        try {
            return restTemplate.postForObject(url, request, Map.class);
        } catch (Exception e) {
            // Default fallback if AI service is unreachable
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("category", "OTHER");
            fallback.put("priority", "MEDIUM");
            fallback.put("suggested_solution", "Pending structural review");
            fallback.put("estimated_hours", 48);
            fallback.put("department", "Citizen Services Helpdesk");
            return fallback;
        }
    }

    public Map<String, Object> simulateScenario(String scenario, int severity, String zoneId) {
        String url = aiServiceUrl + "/ai/simulate";
        Map<String, Object> request = new HashMap<>();
        request.put("scenario", scenario);
        request.put("severity", severity);
        request.put("zone_id", zoneId);

        try {
            return restTemplate.postForObject(url, request, Map.class);
        } catch (Exception e) {
             Map<String, Object> fallback = new HashMap<>();
             fallback.put("scenario", scenario);
             return fallback;
        }
    }
}
