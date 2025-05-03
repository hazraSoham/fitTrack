package com.soham.activityservice.services;

import com.soham.activityservice.models.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMQProducer {

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    @Value("${rabbitmq.queue.name}")
    private String queueName;

    private final RabbitTemplate rabbitTemplate;

    public void publishActivity(Activity activity) {
        try {
            rabbitTemplate.convertAndSend(exchangeName, routingKey, activity);
        } catch (Exception e) {
            log.error("Failed to Publish activity : {0}", e);
        }

    }
}
