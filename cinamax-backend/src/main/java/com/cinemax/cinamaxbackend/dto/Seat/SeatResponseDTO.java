package com.cinemax.cinamaxbackend.dto.Seat;

import lombok.Data;

public record SeatResponseDTO(
        Long id,
        Long roomId,
        String rowLabel,
        Integer seatNumber,
        String type
) {}