package com.cinemax.cinamaxbackend.dto.Seat;

import jakarta.validation.constraints.*;
import lombok.Data;

public record SeatRequestDTO(
        @NotNull Long roomId,
        @NotBlank String rowLabel,
        @NotNull @Positive Integer seatNumber,
        String type
) {}
