package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.Seat.SeatResponseDTO;
import com.cinemax.cinamaxbackend.entity.Seat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SeatMapper {

    @Mapping(target = "roomId", source = "room.id")
    SeatResponseDTO toDto(Seat entity);
}
