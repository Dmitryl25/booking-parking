package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class First_Contoller {
    @GetMapping("/hello")
    public Map<String, Object> getJson() {
        // создаём "JSON" как Map
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello API");
        response.put("status", 200);
        return response; // Spring Boot автоматически превратит в JSON
    }
}
