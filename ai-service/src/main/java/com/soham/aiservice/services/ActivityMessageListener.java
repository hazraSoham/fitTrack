package com.soham.aiservice.services;

import com.soham.aiservice.models.Activity;
import com.soham.aiservice.models.Recommendation;
import com.soham.aiservice.repositories.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService activityAIService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void consumeActivity(Activity activity) {
        log.info("Received Activity for Processing: {}", activity.getId());
        Recommendation recommendedActivity = activityAIService.generateRecommendation(activity);
        recommendationRepository.save(recommendedActivity);
    }
}
