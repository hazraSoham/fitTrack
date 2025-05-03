package com.soham.apigateway.config;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.soham.apigateway.dto.RegisterUser;
import com.soham.apigateway.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.text.ParseException;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeyCloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-USER-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        RegisterUser registerUser = getUserDetails(token);

        if (userId == null) {
            userId = registerUser.getKeycloakId();
        }

        if (!userId.isBlank() && !token.isBlank()) {
            String finalUserId = userId;
            return userService
                    .validateUser(userId)
                    .flatMap(exists -> {
                        if (!exists) {
                            if (registerUser != null) {
                                return userService.registerUser(registerUser).thenReturn(true);
                            } else {
                                return Mono.just(true); // RegisterUser null, but still continue
                            }
                        } else {
                            log.info("User already exists, skipping sync");
                            return Mono.just(true);
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedReq = exchange.getRequest()
                                .mutate()
                                .header("X-USER-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedReq).build());
                    }));
        }
        return chain.filter(exchange);
    }

    private RegisterUser getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.substring("Bearer ".length()).trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            return RegisterUser.builder()
                    .email(claimsSet.getStringClaim("email"))
                    .keycloakId(claimsSet.getStringClaim("sub"))
                    .username(claimsSet.getStringClaim("preferred_username"))
                    .firstName(claimsSet.getStringClaim("given_name"))
                    .lastName(claimsSet.getStringClaim("family_name"))
                    .build();
        } catch (ParseException e) {
            log.error("Error while parsing JWT token.");
        }
        return null;
    }
}
