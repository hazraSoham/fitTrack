package com.soham.userservice.controllers;

import com.soham.userservice.dto.RegisterUser;
import com.soham.userservice.dto.ResponseUser;
import com.soham.userservice.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseUser> getUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUser(id));
    }


    @GetMapping("/{keyCloakId}/validate")
    public ResponseEntity<Boolean> getUserValidation(@PathVariable String keyCloakId) {
        boolean status = userService.getUserValidation(keyCloakId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/{keyCloakId}/info")
    public ResponseEntity<Map<String,String>> getUserInfo(@PathVariable String keyCloakId) {
        Map<String,String> userInfo = userService.getUserInfo(keyCloakId);
        return ResponseEntity.ok(userInfo);
    }


    @PostMapping("/register")
    public ResponseEntity<ResponseUser> registerUser(@Valid @RequestBody RegisterUser user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }
}
