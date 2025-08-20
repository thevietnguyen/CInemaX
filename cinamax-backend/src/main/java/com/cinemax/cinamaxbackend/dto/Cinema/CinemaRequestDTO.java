package com.cinemax.cinamaxbackend.dto.Cinema;

import com.cinemax.cinamaxbackend.dto.Room.RoomDTO;
import lombok.Data;

import java.util.List;

@Data
public class CinemaRequestDTO {
    private String name;
    private String address;
    private String city;
    private List<RoomDTO> rooms;
}
