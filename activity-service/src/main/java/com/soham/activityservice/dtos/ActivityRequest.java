package com.soham.activityservice.dtos;

import com.soham.activityservice.models.ActivityType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
public class ActivityRequest {
    private String userId;
    private ActivityType activityType;
    private Long caloriesBurnt;
    private LocalDateTime startTime;
    private Long duration;
    private Map<String, Object> additionalMetrics;
}
