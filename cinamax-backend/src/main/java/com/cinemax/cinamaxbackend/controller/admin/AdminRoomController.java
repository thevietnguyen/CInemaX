// controller/admin/AdminRoomController.java
package com.cinemax.cinamaxbackend.controller.admin;

import com.cinemax.cinamaxbackend.dto.Room.RoomDTO;
import com.cinemax.cinamaxbackend.dto.Room.RoomRequestDTO;
import com.cinemax.cinamaxbackend.dto.Room.RoomResponseDTO;
import com.cinemax.cinamaxbackend.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoomController {

    private final RoomService roomService;

    // Lấy danh sách các phòng của một rạp
    @GetMapping("/cinemas/{cinemaId}/rooms")
    public ResponseEntity<List<RoomDTO>> getRoomsByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(roomService.getRoomsByCinemaId(cinemaId));
    }

    // Tạo một phòng mới cho một rạp
    @PostMapping("/cinemas/{cinemaId}/rooms")
    public ResponseEntity<RoomDTO> createRoom(@PathVariable Long cinemaId, @Valid @RequestBody RoomRequestDTO requestDTO) {
        RoomDTO createdRoom = roomService.createRoom(cinemaId, requestDTO);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    // Cập nhật một phòng cụ thể
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long roomId, @Valid @RequestBody RoomRequestDTO requestDTO) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, requestDTO));
    }

    // Xóa một phòng cụ thể
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }
}