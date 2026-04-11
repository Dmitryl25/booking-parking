package com.example.demo.controller;

import com.example.demo.dto.GetCategory;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    public ResponseEntity<?> getAllOfficeCategory(@PathVariable("officeId") Long officeId) {
        List<GetCategory> ans = new ArrayList<GetCategory>();

        try{
            List<Category> category = bookingService.getAllCategoryOffice(officeId);
            for(Category c : category){
                GetCategory getCategory = new GetCategory();
                getCategory.setId(c.getId());
                getCategory.setName(c.getName());
                ans.add(getCategory);
            }
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(ans);
    }
}
