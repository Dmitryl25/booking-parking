package com.example.demo.repository;

import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameAndOfficeId(String name, Long officeId);
    List<Category> findByOfficeId(Long officeId);
    Boolean existsByName(String name);
    boolean existsByIdAndOfficeId(Long id, Long officeId);



}
