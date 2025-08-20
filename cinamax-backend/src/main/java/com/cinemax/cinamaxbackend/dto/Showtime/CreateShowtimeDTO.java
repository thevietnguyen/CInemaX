package com.cinemax.cinamaxbackend.dto.Showtime;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateShowtimeDTO(
        @NotNull Long movieId,
        @NotNull Long roomId,
        @NotNull LocalDateTime startTime,
        @NotNull LocalDateTime endTime,
        @DecimalMin("0.0") BigDecimal price
) {}

