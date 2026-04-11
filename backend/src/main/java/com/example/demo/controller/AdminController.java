package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
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
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    @PostMapping("admin/users")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try{
            AuthResponse ans = authService.register(request);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>("User created", HttpStatus.CREATED);
    }


    @GetMapping("admin/users")
    public ResponseEntity<List<UserView>> getAllUsers() {
        return ResponseEntity.ok(bookingService.getAllUser());
    }

    @PutMapping("admin/users/{id}")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUser user, @PathVariable("id") Long id) {
        try{
            bookingService.updateUser(user, id);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("updated", HttpStatus.OK);
    }

    @DeleteMapping("admin/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        try{
            bookingService.deleteUser(id);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
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
    public ResponseEntity<Category> createCategory(@RequestBody CategoryView catView, @PathVariable("officeId") Long officeId) {
        Category cat;
        try{
            cat = bookingService.createCategory(catView, officeId);
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
