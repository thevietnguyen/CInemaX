package com.cinemax.cinamaxbackend.dto.Showtime;

import com.cinemax.cinamaxbackend.entity.Showtime;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ShowtimeResponseDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long roomId;
    private String roomName;
    private String cinemaName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal price;
    private Showtime.Status status;
}

