package com.example.demo.service;

import com.example.demo.repository.SpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
public class Clean {

    @Autowired
    SpotRepository spotRepository;

    @Transactional
    @Scheduled(cron = "0 0 4 * * ?")
    public void clean(){
        ZonedDateTime now = ZonedDateTime.now();
        spotRepository.deleteAllByFinishBefore(now);
    }
}
