package com.cinemax.cinamaxbackend.dto.Room;

import com.cinemax.cinamaxbackend.enums.ScreenType;
import lombok.Data;

public record RoomDTO(
        Long id,
        String name,
        Integer capacity,
        ScreenType screenType,
        Boolean isActive,
        Long cinemaId
) {}