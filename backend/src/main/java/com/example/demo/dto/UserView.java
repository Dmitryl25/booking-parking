package com.example.demo.dto;

import lombok.Data;

@Data
public class UserView {
    private Long id;
    private String email;
    private String name;
    private String licensePlate;
}
