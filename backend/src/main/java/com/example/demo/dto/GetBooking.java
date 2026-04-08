package com.example.demo.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class GetBooking {
    private Long Id;
    private String spotNumber;
    private String office;
    private String category;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
}
