package com.cinemax.cinamaxbackend.repository;

import com.cinemax.cinamaxbackend.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByRoomId(Long roomId);
    boolean existsByRoomIdAndRowLabelAndSeatNumber(Long roomId, String rowLabel, Integer seatNumber);
}
