package com.example.demo.dto;

import lombok.Getter;

import jakarta.persistence.Column;

@Getter
public class CategoryView {
    private String name;
    private String spotsName;
    private Integer spot_count;
}
