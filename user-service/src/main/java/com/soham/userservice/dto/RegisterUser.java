package com.soham.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUser {
    @NotBlank(message = "User name is required")
    private String username;

    @NotBlank
    private String keycloakId;

    @NotBlank
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;
}
