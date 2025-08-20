package com.cinemax.cinamaxbackend.controller.admin;

import com.cinemax.cinamaxbackend.dto.Showtime.CreateShowtimeDTO;
import com.cinemax.cinamaxbackend.dto.Showtime.UpdateShowtimeDTO;
import com.cinemax.cinamaxbackend.dto.Showtime.ShowtimeResponseDTO;
import com.cinemax.cinamaxbackend.service.ShowtimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/showtimes")
@PreAuthorize("hasRole('ADMIN')")
public class AdminShowtimeController {

    private final ShowtimeService service;
    public AdminShowtimeController(ShowtimeService service) { this.service = service; }

    @PostMapping("/create")
    public ResponseEntity<ShowtimeResponseDTO> create(@Valid @RequestBody CreateShowtimeDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ShowtimeResponseDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateShowtimeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<ShowtimeResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @GetMapping
    public Page<ShowtimeResponseDTO> list (
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return service.list(pageable, query);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
