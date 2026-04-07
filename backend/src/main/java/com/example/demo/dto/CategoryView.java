package com.example.demo.dto;

import lombok.Getter;

import javax.persistence.Column;

@Getter
public class CategoryView {
    private String name;
    private Integer spot_count;
    private Long office_id;
}
