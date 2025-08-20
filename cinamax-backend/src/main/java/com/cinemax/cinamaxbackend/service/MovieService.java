package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.Movie.MovieRequestDTO;
import com.cinemax.cinamaxbackend.dto.Movie.MovieResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface MovieService {
    Page<MovieResponseDTO> getMoviesByStatus(String status, Pageable pageable);
    MovieResponseDTO createMovie(MovieRequestDTO movieRequestDTO);
    MovieResponseDTO updateMovie(Long id, MovieRequestDTO movieRequestDTO);
    void deleteMovie(Long id);
    Page<MovieResponseDTO> getAllMovies(Pageable pageable, String query);

    Page<MovieResponseDTO> getPublishedMovies(String status, Pageable pageable);
//    Page<MovieResponseDTO> searchMovies(String query, int page, int size);
}
