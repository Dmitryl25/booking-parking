package com.example.demo.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SpotInfo {
    ZonedDateTime startTime;
    ZonedDateTime endTime;
}
