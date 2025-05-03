package com.soham.activityservice.services;

import com.soham.activityservice.dtos.UserInfo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@AllArgsConstructor
public class ActivityUsersService {

    private final WebClient userWebClient;

    public boolean validateUser(String keyCloakId) {

        return Boolean.TRUE.equals(
                userWebClient.get()
                        .uri("/api/users/{keyCloakId}/validate", keyCloakId)
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .block());
    }

    public UserInfo userInfo(String keyCloakId) {
        return userWebClient.get()
                .uri("/api/users/{keyCloakId}/info", keyCloakId)
                .retrieve()
                .bodyToMono(UserInfo.class)
                .block();
    }
}
