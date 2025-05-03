package com.soham.apigateway.service;

import com.soham.apigateway.dto.RegisterUser;
import com.soham.apigateway.dto.ResponseUser;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private final WebClient userWebClient;

    public Mono<Boolean> validateUser(String userId) {
        log.info("Validating user with id {}", userId);
        return userWebClient.get()
                .uri("/api/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(ex -> {
                    log.error("Error validating user {}: {}", userId, ex.getMessage(), ex);
                    return Mono.just(false); // fallback to "not exists" if there's an issue
                });
    }

    public Mono<ResponseUser> registerUser(RegisterUser registerUser) {
        log.info("Calling User Registration API for userID {}", registerUser.getKeycloakId());
        return userWebClient.post()
                .uri("/api/users/register")
                .bodyValue(registerUser)
                .retrieve()
                .bodyToMono(ResponseUser.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        return Mono.error(new RuntimeException("Bad Request: " + e.getMessage()));
                    else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR)
                        return Mono.error(new RuntimeException("Internal Server Error: " + e.getMessage()));
                    return Mono.error(new RuntimeException("Unknown Error: " + e.getMessage()));
                });
    }
}
