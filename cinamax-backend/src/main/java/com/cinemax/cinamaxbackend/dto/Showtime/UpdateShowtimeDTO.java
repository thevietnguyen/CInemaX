package com.cinemax.cinamaxbackend.dto.Showtime;

import com.cinemax.cinamaxbackend.entity.Showtime;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UpdateShowtimeDTO(
        @NotNull LocalDateTime startTime,
        @NotNull LocalDateTime endTime,
        @DecimalMin("0.0") BigDecimal price,
        Showtime.Status status
) {}

