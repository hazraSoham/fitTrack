package com.soham.activityservice.services;

import com.soham.activityservice.dtos.ActivityRequest;
import com.soham.activityservice.dtos.ActivityResponse;
import com.soham.activityservice.dtos.UserInfo;
import com.soham.activityservice.models.Activity;
import com.soham.activityservice.repositories.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityUsersService activityUsersService;
    private final ActivityMQProducer activityMQProducer;

    public ActivityResponse addActivity(ActivityRequest activityRequest, String keyCloakId) {

        log.info("Validating user for activity request");
        boolean isValidUser = activityUsersService.validateUser(keyCloakId);

        if(!isValidUser) {
            throw new RuntimeException("Invalid Id");
        }

        UserInfo userInfo;
        try{
            userInfo = activityUsersService.userInfo(keyCloakId);
        } catch(Exception e){
            throw new RuntimeException("Invalid user");
        }

        Activity activity = Activity.builder()
                .userId(userInfo.getUserId())
                .activityType(activityRequest.getActivityType())
                .caloriesBurnt(activityRequest.getCaloriesBurnt())
                .duration(activityRequest.getDuration())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        // publish activity to MQ for ai-service
        activityMQProducer.publishActivity(savedActivity);

        return getActivityResponse(savedActivity);
    }

    public List<ActivityResponse> getUserActivities(String keyCloakId) {
        log.info("Fetching activities");

        UserInfo userInfo;
        try{
            userInfo = activityUsersService.userInfo(keyCloakId);
        } catch(Exception e){
            throw new RuntimeException("Invalid user");
        }

        List<Activity> activities = activityRepository.findByUserId(userInfo.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        return activities.parallelStream().map(this::getActivityResponse).toList();
    }

    public ActivityResponse getActivity(String activityId) {
        return getActivityResponse(
                activityRepository.findById(activityId)
                        .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId)));
    }

    private ActivityResponse getActivityResponse(Activity activity) {
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(activity.getId());
        activityResponse.setUserId(activity.getUserId());
        activityResponse.setActivityType(activity.getActivityType());
        activityResponse.setCaloriesBurnt(activity.getCaloriesBurnt());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedAt(activity.getUpdatedAt());
        return activityResponse;
    }


}
