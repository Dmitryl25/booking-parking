package com.example.demo.repository;

import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.entity.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM Spot s " +
            "WHERE s.category.id = :categoryId " +
            "AND s.office.id = :officeId " +
            "AND s.spot_number = :spot_number " +
            "AND s.start < :requestedEndTime " +
            "AND s.finish > :requestedStartTime")
    boolean isSpotBookedBetween(
            @Param("categoryId") Long catId,
            @Param("officeId") Long officeId,
            @Param("spot_number") String spot_number,

            @Param("requestedStartTime") ZonedDateTime requestedStartTime,
            @Param("requestedEndTime") ZonedDateTime requestedEndTime
    );


    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM Spot s " +
            "WHERE s.category.id = :categoryId " +
            "AND s.office.id = :officeId " +
            "AND s.spot_number = :spot_number ")
    boolean existsSpotByParameters(
            @Param("categoryId") Long catId,
            @Param("officeId") Long officeId,
            @Param("spot_number") String spot_number
    );


    @Query("SELECT s " +
            "FROM Spot s " +
            "WHERE s.user.id = :userId " +
            "AND s.finish > :data ")
    List<Spot> findByUser_id(
            @Param("userId") Long userId,
            @Param("data") ZonedDateTime data
    );

    void deleteAllByUserId(Long id);

    void deleteAllByOfficeId(Long id);

    void deleteAllByCategoryId(Long id);

    void deleteAllBySpot_number(String  spot_number);
}
