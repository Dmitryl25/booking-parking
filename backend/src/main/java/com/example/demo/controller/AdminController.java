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


    @PostMapping("admin/offices")
    public ResponseEntity<?> createOffice(@RequestBody OfficeView officeView) {
        Office office;
        try{
            office = bookingService.createOffice(officeView);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(office, HttpStatus.CREATED);
    }


    @PutMapping("admin/offices/{id}")
    public ResponseEntity<?> updateOffice(@RequestBody OfficeView officeView, @PathVariable("id") Long id) {
        try{
            bookingService.updateOffice(officeView, id);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Updated", HttpStatus.OK);
    }

    @DeleteMapping("admin/offices/{id}")
    public ResponseEntity<?> deleteOffice(@PathVariable("id") Long id) {
        try{
            bookingService.deleteOffice(id);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Office deleted successfully", HttpStatus.OK);
    }


    @PostMapping("admin/offices/{officeId}/categories")
    public ResponseEntity<?> createCategory(@RequestBody CategoryView catView, @PathVariable("officeId") Long officeId) {
        Category cat;
        try{
            cat = bookingService.createCategory(catView, officeId);
        }
        catch (RuntimeException e) {
            if (e.getMessage().equals("Office not found")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            else{
                return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
            }
        }
        return new ResponseEntity<>("Created", HttpStatus.CREATED);
    }

    @PutMapping("admin/offices/{officeId}/categories/{id}")
    public ResponseEntity<?> updateCategory(@RequestBody UpdateCategory cat, @PathVariable("officeId") Long officeId,  @PathVariable("id") Long id) {
        try{
            bookingService.updateCategory(id, officeId, cat);
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Updated", HttpStatus.OK);
    }

    @DeleteMapping("admin/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id) {
        try{
            bookingService.deleteCategory(id);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
    }


    @PostMapping("admin/parking-spots")
    public ResponseEntity<?> addPost(@RequestBody AddSpot spot) {
        try{
            bookingService.addSpot(spot);
        }
        catch (IllegalArgumentException e) {
            if (e.getMessage().equals("invalid request")) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
            else{
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Created", HttpStatus.CREATED);
    }

    @DeleteMapping("admin/parking-spots")
    public ResponseEntity<?> deletePost(@RequestBody AddSpot spot) {
        try{
            bookingService.deleteSpot(spot);
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>("Deleted", HttpStatus.CREATED);
    }
}
