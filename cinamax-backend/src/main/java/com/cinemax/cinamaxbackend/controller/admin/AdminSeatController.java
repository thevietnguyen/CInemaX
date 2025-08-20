package com.cinemax.cinamaxbackend.controller.admin;

import com.cinemax.cinamaxbackend.dto.Seat.SeatRequestDTO;
import com.cinemax.cinamaxbackend.dto.Seat.SeatResponseDTO;
import com.cinemax.cinamaxbackend.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seats")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSeatController {

    private final SeatService seatService;

    public AdminSeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<SeatResponseDTO>> listByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(seatService.listByRoom(roomId));
    }

    @PostMapping("/create")
    public ResponseEntity<SeatResponseDTO> create(@Valid @RequestBody SeatRequestDTO dto) {
        return ResponseEntity.ok(seatService.create(dto));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        seatService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
