package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.Cinema.CinemaRequestDTO;
import com.cinemax.cinamaxbackend.dto.Cinema.CinemaResponseDTO;
import com.cinemax.cinamaxbackend.entity.Cinema;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {RoomMapper.class})
public interface CinemaMapper {

    CinemaResponseDTO toResponseDTO(Cinema cinema);
    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "rooms", ignore = true)
    Cinema toEntity(CinemaRequestDTO cinemaRequestDTO);
}
