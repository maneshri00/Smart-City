package com.smartcity.controller;

import com.smartcity.model.TrafficData;
import com.smartcity.service.TrafficService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/traffic")
public class TrafficController {

    private final TrafficService trafficService;

    public TrafficController(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    @GetMapping
    public List<TrafficData> getCurrentTraffic() {
        return trafficService.getCurrentTraffic();
    }

    @GetMapping("/heatmap")
    public Object getHeatmapData() {
        return trafficService.getHeatmapData();
    }
}
