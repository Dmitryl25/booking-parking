package com.example.demo.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class BookingCreateRequest {
    private Long officeId;
    private Long categoryId;
    private String number;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
}