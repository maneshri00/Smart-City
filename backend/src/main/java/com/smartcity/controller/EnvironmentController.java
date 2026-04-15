package com.smartcity.controller;

import com.smartcity.service.EnvironmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/environment")
public class EnvironmentController {

    private final EnvironmentService environmentService;

    public EnvironmentController(EnvironmentService environmentService) {
        this.environmentService = environmentService;
    }

    @GetMapping
    public Object getStatus() {
        return environmentService.getEnvironmentStatus();
    }

    @GetMapping("/alerts")
    public Object getAlerts() {
        return environmentService.getAlerts();
    }
}
