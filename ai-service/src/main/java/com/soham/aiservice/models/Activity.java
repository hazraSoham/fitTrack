package com.soham.aiservice.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class Activity {
    private String id;
    private String userId;
    private String activityType;
    private Long caloriesBurnt;
    private LocalDateTime startTime;
    private Long duration;
    private Map<String, Object> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
