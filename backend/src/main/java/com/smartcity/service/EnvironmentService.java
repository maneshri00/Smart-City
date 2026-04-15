package com.smartcity.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class EnvironmentService {

    public Map<String, Object> getEnvironmentStatus() {
        Map<String, Object> data = new HashMap<>();
        data.put("overall_aqi", 85);
        data.put("pollution_level", "Moderate");
        return data;
    }

    public List<String> getAlerts() {
        return List.of("High PM2.5 in Z1", "Water pH dropping in Z3");
    }

    public Map<String, Object> getSustainabilityInsights(int totalVehicles) {
        double carbonEstimate = totalVehicles * 0.004; // mocked factor
        Map<String, Object> result = new HashMap<>();
        result.put("carbon_estimate_tons", carbonEstimate);
        result.put("top_recommendation", "Reduce street lighting in Z4 due to zero traffic");
        result.put("energy_savings_potential", "18%");
        result.put("sustainability_score", 82);
        return result;
    }
}
