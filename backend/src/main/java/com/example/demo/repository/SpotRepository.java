package com.example.demo.repository;

import com.example.demo.dto.SpotInfo;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.entity.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {

    @Transactional(readOnly = true)
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


    @Modifying
    @Transactional
    @Query("DELETE " +
            "FROM Spot s " +
            "WHERE s.category.id = :categoryId " +
            "AND s.office.id = :officeId " +
            "AND s.spot_number = :spot_number " +
            "AND s.start < :requestedEndTime " +
            "AND s.finish > :requestedStartTime")
    void DeleteSpotBookedBetween(
            @Param("categoryId") Long catId,
            @Param("officeId") Long officeId,
            @Param("spot_number") String spot_number,

            @Param("requestedStartTime") ZonedDateTime requestedStartTime,
            @Param("requestedEndTime") ZonedDateTime requestedEndTime
    );


    @Transactional(readOnly = true)
    @Query("SELECT CASE WHEN s.user.role = 'ROLE_ADMIN' THEN true ELSE false END " +
            "FROM Spot s " +
            "WHERE s.category.id = :categoryId " +
            "AND s.office.id = :officeId " +
            "AND s.spot_number = :spot_number ")
    boolean BookedByAdmin(
            @Param("categoryId") Long catId,
            @Param("officeId") Long officeId,
            @Param("spot_number") String spot_number
    );

    @Transactional(readOnly = true)
    @Query("SELECT s " +
            "FROM Spot s " +
            "WHERE s.user.id = :userId " +
            "AND s.finish > :data ")
    List<Spot> findByUser_id(
            @Param("userId") Long userId,
            @Param("data") ZonedDateTime data
    );

    @Transactional(readOnly = true)
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM Spot s " +
            "WHERE s.category.id = :categoryId " +
            "AND s.office.id = :officeId " +
            "AND s.spot_number = :spot_number " +
            "AND s.finish > :data")
    boolean existsSpotByParameters(
            @Param("categoryId") Long catId,
            @Param("officeId") Long officeId,
            @Param("spot_number") String spot_number,
            @Param("data") ZonedDateTime time
    );

    @Modifying
    @Transactional
    void deleteAllByUserId(Long id);

    @Modifying
    @Transactional
    void deleteAllByOfficeId(Long id);

    @Modifying
    @Transactional
    void deleteAllByCategoryId(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Spot s WHERE s.spot_number = :spot_number AND s.office.id = :office_id AND s.category.id = :category_id")
    void deleteAllBySpot_number(@Param("spot_number") String  spot_number,  @Param("category_id") Long category_id, @Param("office_id") Long office_id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Spot s WHERE s.spot_number = :spotNumber AND s.office.id = :officeId AND s.category.id = :categoryId AND s.user.id = :userId")
    void deleteAllByParams(@Param("spotNumber") String  spotNumber,  @Param("categoryId") Long categoryId, @Param("officeId") Long officeId,  @Param("userId") Long userId);


    @Transactional(readOnly = true)
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Spot s WHERE s.spot_number = :spotNumber AND s.office.id = :officeId AND s.category.id = :categoryId AND s.user.id = :userId")
    boolean existSpotForUnblock(@Param("spotNumber") String  spotNumber,  @Param("categoryId") Long categoryId, @Param("officeId") Long officeId,  @Param("userId") Long userId);


    @Transactional(readOnly = true)
    @Query("SELECT new com.example.demo.dto.SpotInfo(s.start, s.finish) FROM Spot s WHERE s.spot_number = :spotNumber AND s.office.id = :officeId AND s.category.id = :categoryId AND s.user.id = :userId")
    List<SpotInfo> getSpotInfo(@Param("spotNumber") String  spotNumber, @Param("categoryId") Long categoryId, @Param("officeId") Long officeId, @Param("userId") Long userId);

    @Modifying
    @Transactional
    void deleteAllByFinishBefore(ZonedDateTime time);

}
