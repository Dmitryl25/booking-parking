package com.example.demo.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "spots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Spot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String spot_number;

    @Column(nullable = false)
    private ZonedDateTime start;
    @Column(nullable = false)
    private ZonedDateTime finish;

    @ManyToOne
    private User user;

    @ManyToOne
    private Office office;

    @ManyToOne
    private Category category;
}
