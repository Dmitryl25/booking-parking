package com.example.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/user")
public class UserController {

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        response.put("email", userDetails.getUsername());
        response.put("roles", userDetails.getAuthorities());
        response.put("message", "Привет, " + userDetails.getUsername());
        return response;
    }

    @GetMapping("/public")
    public String publicEndpoint() {
        return "Это публичный эндпоинт, доступен всем";
    }
}
