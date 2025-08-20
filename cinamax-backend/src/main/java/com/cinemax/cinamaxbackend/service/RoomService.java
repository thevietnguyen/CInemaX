// service/RoomService.java
package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.Room.RoomRequestDTO;
import com.cinemax.cinamaxbackend.dto.Room.RoomDTO; // Sửa import
import java.util.List;

public interface RoomService {
    List<RoomDTO> getRoomsByCinemaId(Long cinemaId);
    RoomDTO createRoom(Long cinemaId, RoomRequestDTO requestDTO);
    RoomDTO updateRoom(Long roomId, RoomRequestDTO requestDTO);
    void deleteRoom(Long roomId);
}