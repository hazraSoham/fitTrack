package com.soham.apigateway.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegisterUser {
    @NotBlank(message = "User name is required")
    private String username;

    private String keycloakId;

    @NotBlank
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;
}
