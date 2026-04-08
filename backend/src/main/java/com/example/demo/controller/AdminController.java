package com.example.demo.controller;

import com.example.demo.dto.CategoryView;
import com.example.demo.dto.OfficeView;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
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
@RequestMapping("api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/offices")
    public ResponseEntity<Office> createOffice(@RequestBody OfficeView officeView) {
        Office office;
        try{
            office = bookingService.createOffice(officeView);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(office, HttpStatus.CREATED);
    }

    @PostMapping("/offices/{officeId}/categories")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryView catView) {
        Category cat;
        try{
            cat = bookingService.createCategory(catView);
        }
        catch (RuntimeException e) {
            if (e.getMessage().equals("Office not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
