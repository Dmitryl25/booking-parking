package com.example.demo.repository;

import com.example.demo.entity.Office;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficeRepository extends JpaRepository<Office, Long>  {
    boolean existsByAddress(String address);
}

