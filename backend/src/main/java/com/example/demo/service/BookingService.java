package com.example.demo.service;


import com.example.demo.dto.*;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.entity.Spot;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.OfficeRepository;
import com.example.demo.repository.SpotRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BookingService {

    @Autowired
    OfficeRepository officeRepository;

    @Autowired
    CategoryRepository catRepository;

    @Autowired
    SpotRepository spotRepository;

    @Autowired
    UserRepository userRepository;

    public Office createOffice(OfficeView office_view) {
        if (officeRepository.existsByAddress(office_view.getAddress())) {
            throw new RuntimeException("Office already exists");
        }
        Office office = new Office();
        office.setAddress(office_view.getAddress());
        officeRepository.save(office);
        return office;
    }

    public Category createCategory(CategoryView cat_view) {
        if (catRepository.existsByNameAndOfficeId(cat_view.getName(), cat_view.getOffice_id())) {
            throw new RuntimeException("Category already exists");
        }

        if (!officeRepository.existsById(cat_view.getOffice_id())) {
            throw new RuntimeException("Office not found");
        }

        Category cat = new Category();
        cat.setName(cat_view.getName());
        cat.setSpot_count(cat_view.getSpot_count());
        cat.setOffice(officeRepository.findById(cat_view.getOffice_id()).get());
        catRepository.save(cat);
        return cat;
    }

    public List<Office> getAllOffice() {
        return officeRepository.findAll();
    }

    public List<Category> getAllCategoryOffice(Long office_id) {
        if  (officeRepository.existsById(office_id)) {
            return catRepository.findByOfficeId(office_id);
        }
        else{
            throw new RuntimeException("Office doesn't exists");
        }
    }

    public List<SpotResponse> getFreeSpots(SpotRequest spotRequest) {
        Category cat = catRepository.getReferenceById(spotRequest.getCategoryId());
        Integer count = cat.getSpot_count();
        List<SpotResponse> spotResponses = new ArrayList<SpotResponse>();
        for (Integer i = 1; i < count + 1; i++) {
            if (!spotRepository.existsSpotByParameters(spotRequest.getCategoryId(), spotRequest.getOfficeId(), i.toString())){
                SpotResponse spot = new SpotResponse();
                spot.setNumber(i.toString());
                spotResponses.add(spot);

            }
            else if (!spotRepository.isSpotBookedBetween(spotRequest.getCategoryId(), spotRequest.getOfficeId(), i.toString(), spotRequest.getStartTime(), spotRequest.getEndTime())) {
                SpotResponse spot = new SpotResponse();
                spot.setNumber(i.toString());
                spotResponses.add(spot);
            }
        }
        return spotResponses;
    }

    public Spot createSpot(SpotCreateRequest spotRequest) {
        if (spotRepository.existsSpotBy5Parameters(spotRequest.getCategoryId(), spotRequest.getOfficeId(), spotRequest.getSpot_number(), spotRequest.getStartTime(), spotRequest.getEndTime())){
            throw new RuntimeException("Spot already exists");
        }
        Spot spot = new Spot();
        spot.setSpot_number(spotRequest.getSpot_number());
        spot.setCategory(catRepository.getReferenceById(spotRequest.getCategoryId()));
        spot.setOffice(officeRepository.getReferenceById(spotRequest.getOfficeId()));
        spot.setUser(userRepository.getReferenceById(spotRequest.getUserId()));
        spot.setStart(spotRequest.getStartTime());
        spot.setFinish(spotRequest.getEndTime());
        return  spotRepository.save(spot);
    }
}
