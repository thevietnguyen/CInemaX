package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.Seat.SeatRequestDTO;
import com.cinemax.cinamaxbackend.dto.Seat.SeatResponseDTO;

import java.util.List;

public interface SeatService {
    List<SeatResponseDTO> listByRoom(Long roomId);
    SeatResponseDTO create(SeatRequestDTO dto);
    void delete(Long id);
}
