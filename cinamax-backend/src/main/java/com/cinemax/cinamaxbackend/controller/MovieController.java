package com.cinemax.cinamaxbackend.controller;

import com.cinemax.cinamaxbackend.dto.Movie.MovieResponseDTO;
import com.cinemax.cinamaxbackend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping()
    public ResponseEntity<Page<MovieResponseDTO>> getMovies(
            @RequestParam(defaultValue = "NOW_SHOWING") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("releaseDate").descending());
        Page<MovieResponseDTO> moviePage = movieService.getPublishedMovies(status, pageable);
        return ResponseEntity.ok(moviePage);
    }

}
