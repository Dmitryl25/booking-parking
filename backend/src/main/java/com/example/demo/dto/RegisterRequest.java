package com.example.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String name;
    private String licensePlate;
    private String password;
    private String role;
}
