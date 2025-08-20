package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.Cinema.CinemaRequestDTO;
import com.cinemax.cinamaxbackend.dto.Cinema.CinemaResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CinemaService {
    CinemaResponseDTO createCinema(CinemaRequestDTO requestDTO);
    CinemaResponseDTO updateCinema(Long id, CinemaRequestDTO requestDTO);
    void deleteCinema(Long id);
    Page<CinemaResponseDTO> getAllCinemas(Pageable pageable, String query);
    List<CinemaResponseDTO> getAllCinemasWithRooms();

    CinemaResponseDTO getCinemaById(Long id);
}
