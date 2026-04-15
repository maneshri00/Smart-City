package com.smartcity.repository;

import com.smartcity.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, UUID> {
    List<SensorData> findByTimestampAfterOrderByTimestampAsc(LocalDateTime timestamp);
}
