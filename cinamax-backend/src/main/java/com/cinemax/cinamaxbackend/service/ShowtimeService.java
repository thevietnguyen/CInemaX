package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.Showtime.CreateShowtimeDTO;
import com.cinemax.cinamaxbackend.dto.Showtime.UpdateShowtimeDTO;
import com.cinemax.cinamaxbackend.dto.Showtime.ShowtimeResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ShowtimeService {
    ShowtimeResponseDTO create(CreateShowtimeDTO dto);
    ShowtimeResponseDTO update(Long id, UpdateShowtimeDTO dto);
    void delete(Long id);
    ShowtimeResponseDTO get(Long id);
    Page<ShowtimeResponseDTO> list(Pageable pageable, String query);
}
