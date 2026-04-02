package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;      // вход по email
    private String password;
}