package com.smartcity.repository;

import com.smartcity.model.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrafficDataRepository extends JpaRepository<TrafficData, UUID> {
    List<TrafficData> findByTimestampAfterOrderByTimestampAsc(LocalDateTime timestamp);
}
