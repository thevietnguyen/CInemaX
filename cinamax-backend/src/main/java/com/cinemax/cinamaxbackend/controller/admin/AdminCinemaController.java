package com.cinemax.cinamaxbackend.controller.admin;

import com.cinemax.cinamaxbackend.dto.Cinema.CinemaRequestDTO;
import com.cinemax.cinamaxbackend.dto.Cinema.CinemaResponseDTO;
import com.cinemax.cinamaxbackend.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


// controller/admin/AdminCinemaController.java
@RestController
@RequestMapping("/api/admin/cinemas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCinemaController {
    private final CinemaService cinemaService;

    @PostMapping("/create")
    public ResponseEntity<CinemaResponseDTO> createCinema(@RequestBody CinemaRequestDTO requestDTO) {
        return new ResponseEntity<>(cinemaService.createCinema(requestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<CinemaResponseDTO> updateCinema(@PathVariable Long id, @RequestBody CinemaRequestDTO requestDTO) {
        return ResponseEntity.ok(cinemaService.updateCinema(id, requestDTO));
    }

    @GetMapping
    public Page<CinemaResponseDTO> getCinemas(Pageable pageable, @RequestParam(required = false) String query) {
        return cinemaService.getAllCinemas(pageable, query);
    }

    @GetMapping("/with-rooms")
    public List<CinemaResponseDTO> getCinemasWithRooms() {
        return cinemaService.getAllCinemasWithRooms();
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CinemaResponseDTO> getCinemaById(@PathVariable Long id) {
        return ResponseEntity.ok(cinemaService.getCinemaById(id));
    }
}
