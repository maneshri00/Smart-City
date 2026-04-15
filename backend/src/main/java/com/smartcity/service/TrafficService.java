package com.smartcity.service;

import com.smartcity.model.TrafficData;
import com.smartcity.repository.TrafficDataRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class TrafficService {

    private final TrafficDataRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    public TrafficService(TrafficDataRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<TrafficData> getCurrentTraffic() {
        List<TrafficData> all = repository.findAll();
        return all.subList(Math.max(all.size() - 5, 0), all.size());
    }

    public Object getHeatmapData() {
        return getCurrentTraffic();
    }

    @Scheduled(fixedRate = 5000)
    public void simulateTraffic() {
        TrafficData data = new TrafficData();
        data.setTimestamp(LocalDateTime.now());
        data.setZoneId("Z" + (random.nextInt(5) + 1));
        
        int vehicles = 100 + random.nextInt(2000);
        data.setVehicleCount(vehicles);
        data.setAvgSpeedKmh(10.0 + random.nextDouble() * 50);

        if (vehicles < 500) data.setCongestionLevel(TrafficData.CongestionLevel.LOW);
        else if (vehicles < 1000) data.setCongestionLevel(TrafficData.CongestionLevel.MEDIUM);
        else if (vehicles < 1500) data.setCongestionLevel(TrafficData.CongestionLevel.HIGH);
        else {
            data.setCongestionLevel(TrafficData.CongestionLevel.CRITICAL);
            messagingTemplate.convertAndSend("/topic/alerts", 
                "CRITICAL ALERT: Traffic Congestion in " + data.getZoneId());
        }

        repository.save(data);
    }
}
