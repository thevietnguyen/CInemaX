package com.cinemax.cinamaxbackend.dto.Movie;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MovieResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String genres;
    private int durationInMinutes;
    private String posterUrl;
    private String trailerUrl;
    private LocalDate releaseDate;
    private String status;
}