package com.example.demo.controller;

import com.example.demo.dto.OfficeView;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class GeneralController {
    @Autowired
    private BookingService bookingService;

    @GetMapping("/offices")
    public ResponseEntity<List<Office>> getAllOffice() {
        return ResponseEntity.ok(bookingService.getAllOffice());
    }

    @GetMapping("/offices/{officeId}/categories")
    public ResponseEntity<List<Category>> getAllOfficeCategory(@PathVariable("officeId") Long officeId) {
        List<Category> category;

        try{
            category = bookingService.getAllCategoryOffice(officeId);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(category);
    }
}
