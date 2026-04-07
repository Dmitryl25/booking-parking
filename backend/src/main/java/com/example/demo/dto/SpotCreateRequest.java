package com.example.demo.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SpotCreateRequest {
    private String spot_number;
    private Long userId;
    private Long officeId;
    private Long categoryId;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;

}
