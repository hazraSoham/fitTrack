package com.soham.userservice.services;

import com.soham.userservice.dto.RegisterUser;
import com.soham.userservice.dto.ResponseUser;
import com.soham.userservice.models.User;
import com.soham.userservice.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private UserRepository userRepository;

    public ResponseUser getUser(String id) {
        User user = userRepository.findById(UUID.fromString(id)).orElseThrow(() -> new RuntimeException("User not found"));
        return convertToResponseUser(user);
    }

    public ResponseUser registerUser(RegisterUser registerUser) {

        if(userRepository.existsByEmail(registerUser.getEmail())) {
            User existingUser = userRepository.findByEmail(registerUser.getEmail());
            return convertToResponseUser(existingUser);
        }

        User user = new User();
        user.setKeycloakId(registerUser.getKeycloakId());
        user.setUsername(registerUser.getUsername());
        user.setEmail(registerUser.getEmail());
        user.setFirstName(registerUser.getFirstName());
        user.setLastName(registerUser.getLastName());

        userRepository.save(user);

        return convertToResponseUser(user);
    }

    public Boolean getUserValidation(String keyCloakId) {
        log.info("Validating user keyCloakId: {}", keyCloakId);
        return userRepository.existsByKeycloakId(keyCloakId);
    }

    private ResponseUser convertToResponseUser(User user) {
        return ResponseUser.builder()
                .id(user.getId())
                .keycloakId(user.getKeycloakId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }


    public Map<String, String> getUserInfo(String keyCloakId) {
        log.info("Getting user info for keyCloakId: {}", keyCloakId);

        if(userRepository.existsByKeycloakId(keyCloakId)) {
            User user = userRepository.findByKeycloakId(keyCloakId);
            return Collections.singletonMap("userId", user.getId().toString());
        }
        return Collections.emptyMap();
    }
}
