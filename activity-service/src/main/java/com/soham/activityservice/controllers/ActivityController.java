package com.soham.activityservice.controllers;

import com.soham.activityservice.dtos.ActivityRequest;
import com.soham.activityservice.dtos.ActivityResponse;
import com.soham.activityservice.services.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> addActivity(@RequestHeader("X-USER-ID") String userId, @RequestBody ActivityRequest activityRequest) {
        return ResponseEntity.ok(activityService.addActivity(activityRequest, userId));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@RequestHeader("X-USER-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId) {
        return ResponseEntity.ok(activityService.getActivity(activityId));
    }

}
