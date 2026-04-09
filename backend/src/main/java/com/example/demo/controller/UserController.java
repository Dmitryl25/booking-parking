package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.dto.Error;
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
@RequestMapping("api/")
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
    public ResponseEntity<?> getFreeSpot(@RequestBody SpotRequest spotRequest) {

        List<SpotResponse> spots;
        try{
            spots = bookingService.getFreeSpots(spotRequest);
        }
        catch (IllegalArgumentException e) {
            com.example.demo.dto.Error error = new Error();
            error.setMessage("Invalid date range");
            return new ResponseEntity<>("Invalid date range", HttpStatus.BAD_REQUEST);
        }
        catch (RuntimeException e) {
            com.example.demo.dto.Error error = new Error();
            error.setMessage("Office not found");
            return new ResponseEntity<>("Office not found", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(spots);
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> Booking(@RequestBody BookingCreateRequest spotRequest, @AuthenticationPrincipal UserDetails userDetails) {
        Spot spot;

        try{
            spot = bookingService.createSpot(spotRequest, userDetails.getUsername());
        }
        catch (IllegalArgumentException e) {
            if (e.getMessage().equals("Spot not found")) {
                com.example.demo.dto.Error error = new Error();
                error.setMessage("Spot not found");
                return new ResponseEntity<>("Spot not found", HttpStatus.NOT_FOUND);
            }
            com.example.demo.dto.Error error = new Error();
            error.setMessage("Invalid request (endTime before startTime)");
            return new ResponseEntity<>("Invalid request (endTime before startTime)", HttpStatus.BAD_REQUEST);
        }
        catch (RuntimeException e) {
            com.example.demo.dto.Error error = new Error();
            error.setMessage("Spot already booked for this time");
            return new ResponseEntity<>("Spot already booked for this time", HttpStatus.CONFLICT);
        }
        com.example.demo.dto.Error error = new Error();
        error.setMessage("Created");
        return new ResponseEntity<>(error, HttpStatus.CREATED);
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<?> getActiveBooking(@AuthenticationPrincipal UserDetails userDetails) {
        List<GetBooking> spots = bookingService.getActiveBooking(userDetails.getUsername());
        return ResponseEntity.ok(spots);
    }
}
