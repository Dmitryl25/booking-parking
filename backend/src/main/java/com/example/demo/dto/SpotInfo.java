package com.example.demo.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SpotInfo {
    ZonedDateTime startTime;
    ZonedDateTime endTime;

    public SpotInfo(ZonedDateTime startTime, ZonedDateTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
