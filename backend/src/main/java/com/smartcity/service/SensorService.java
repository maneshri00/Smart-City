package com.smartcity.service;

import com.smartcity.model.SensorData;
import com.smartcity.repository.SensorDataRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class SensorService {

    private final SensorDataRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    public SensorService(SensorDataRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<SensorData> getLatestReadings() {
        List<SensorData> all = repository.findAll();
        return all.subList(Math.max(all.size() - 10, 0), all.size());
    }

    public List<SensorData> getHistoryLast24Hours() {
        return repository.findByTimestampAfterOrderByTimestampAsc(LocalDateTime.now().minusHours(24));
    }

    @Scheduled(fixedRate = 5000)
    public void simulateSensorData() {
        SensorData data = new SensorData();
        data.setTimestamp(LocalDateTime.now());
        data.setZoneId("Z" + (random.nextInt(5) + 1));
        
        int aqi = 20 + random.nextInt(200);
        data.setAqi(aqi);
        data.setTemperature(15.0 + random.nextDouble() * 20);
        data.setHumidity(40.0 + random.nextDouble() * 50);
        data.setWaterPh(6.5 + random.nextDouble() * 2);
        data.setSource("LiveIoT-Sim");

        repository.save(data);

        messagingTemplate.convertAndSend("/topic/sensor-updates", data);

        if (aqi > 200) {
            messagingTemplate.convertAndSend("/topic/alerts", 
                "CRITICAL ALERT: AQI Spike in " + data.getZoneId() + " (Level: " + aqi + ")");
        }
    }
}
