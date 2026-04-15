package com.smartcity.controller;

import com.smartcity.model.SensorData;
import com.smartcity.service.SensorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sensor-data")
public class SensorDataController {

    private final SensorService sensorService;

    public SensorDataController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping
    public List<SensorData> getLatestReadings() {
        return sensorService.getLatestReadings();
    }

    @GetMapping("/history")
    public List<SensorData> getHistory() {
        return sensorService.getHistoryLast24Hours();
    }
}
