package com.example.demo.controller;

import com.example.demo.dto.BookingCreateRequest;
import com.example.demo.dto.SpotRequest;
import com.example.demo.dto.SpotResponse;
import com.example.demo.entity.Spot;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        response.put("email", userDetails.getUsername());
        response.put("roles", userDetails.getAuthorities());
        response.put("message", "Привет, " + userDetails.getUsername());
        return response;
    }


    @GetMapping("/bookings/search")
    private ResponseEntity<List<SpotResponse>> getFreeSpot(@RequestBody SpotRequest spotRequest) {
        List<SpotResponse> spots;
        try{
            spots = bookingService.getFreeSpots(spotRequest);
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(spots);
    }

    @PostMapping("/bookings")
    private ResponseEntity<Long> Booking(@RequestBody BookingCreateRequest spotRequest, @AuthenticationPrincipal UserDetails userDetails) {
        Spot spot;

        try{
            spot = bookingService.createSpot(spotRequest, userDetails.getUsername());
        }
        catch (IllegalArgumentException e) {
            if (e.getMessage().equals("Spot not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(spot.getId(), HttpStatus.CREATED);
    }
}
