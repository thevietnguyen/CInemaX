package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.Movie.MovieRequestDTO;
import com.cinemax.cinamaxbackend.dto.Movie.MovieResponseDTO;
import com.cinemax.cinamaxbackend.entity.Movie;
import com.cinemax.cinamaxbackend.entity.User;
import com.cinemax.cinamaxbackend.enums.MovieStatus;
import com.cinemax.cinamaxbackend.mapper.MovieMapper;
import com.cinemax.cinamaxbackend.repository.MovieRepository;
import com.cinemax.cinamaxbackend.service.MovieService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    @Override
    public Page<MovieResponseDTO> getMoviesByStatus(String status, Pageable pageable) {
        return null;
    }


    @Override
    public Page<MovieResponseDTO> getAllMovies(Pageable pageable, String query) {
        if (!StringUtils.hasText(query)) {
            return movieRepository.findAll(pageable).map(movieMapper::toResponseDTO);
        }
        Specification<Movie> spec = (root, q, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + query.toLowerCase() + "%");

        return movieRepository.findAll(spec, pageable).map(movieMapper::toResponseDTO);
    }

    @Override
    public MovieResponseDTO createMovie(MovieRequestDTO movieRequestDTO) {
        Movie movie = movieMapper.toEntity(movieRequestDTO);
        Movie savedMovie = movieRepository.save(movie);
        return movieMapper.toResponseDTO(savedMovie);
    }

    @Override
    @Transactional
    public MovieResponseDTO updateMovie(Long id, MovieRequestDTO movieRequestDTO) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim với ID: " + id));

        existingMovie.setTitle(movieRequestDTO.getTitle());
        existingMovie.setDescription(movieRequestDTO.getDescription());
        existingMovie.setDurationInMinutes(movieRequestDTO.getDurationInMinutes());
        existingMovie.setPosterUrl(movieRequestDTO.getPosterUrl());
        existingMovie.setTrailerUrl(movieRequestDTO.getTrailerUrl());
        existingMovie.setReleaseDate(movieRequestDTO.getReleaseDate());
        existingMovie.setStatus(MovieStatus.valueOf(movieRequestDTO.getStatus().toUpperCase()));
        existingMovie.setGenres(movieRequestDTO.getGenres());

        Movie updatedMovie = movieRepository.save(existingMovie);
        return movieMapper.toResponseDTO(updatedMovie);
    }

    @Override
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phim với ID: " + id + " để xóa.");
        }
        movieRepository.deleteById(id);
    }

    @Override
    public Page<MovieResponseDTO> getPublishedMovies(String status, Pageable pageable) {
        MovieStatus movieStatus = MovieStatus.valueOf(status.toUpperCase());
        return movieRepository.findByStatus(movieStatus, pageable).map(movieMapper::toResponseDTO);
    }

//    @Override
//    public Page<MovieResponseDTO> searchMovies(String query, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<Movie> moviePage = movieRepository.findByTitleContainingIgnoreCase(query, pageable);
//        return moviePage.map(movieMapper::toResponseDTO);
//    }
}
