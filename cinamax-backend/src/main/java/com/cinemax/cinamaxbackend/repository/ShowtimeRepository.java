package com.cinemax.cinamaxbackend.repository;

import com.cinemax.cinamaxbackend.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long>, JpaSpecificationExecutor<Showtime> {

    @Query("SELECT s FROM Showtime s " +
            "WHERE s.room.id = :roomId " +
            "AND s.status = com.cinemax.cinamaxbackend.entity.Showtime.Status.SCHEDULED " +
            "AND s.endTime > :start " +
            "AND s.startTime < :end")
    List<Showtime> findOverlaps(@Param("roomId") Long roomId,
                                @Param("start") LocalDateTime start,
                                @Param("end") LocalDateTime end);
}
