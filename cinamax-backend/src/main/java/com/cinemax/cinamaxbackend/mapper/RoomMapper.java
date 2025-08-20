// mapper/RoomMapper.java
package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.Room.RoomRequestDTO;
import com.cinemax.cinamaxbackend.dto.Room.RoomDTO; // Sửa import
import com.cinemax.cinamaxbackend.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoomMapper {

    @Mapping(source = "cinema.id", target = "cinemaId")
    RoomDTO toDto(Room room);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cinema", ignore = true)
    @Mapping(target = "showtimes", ignore = true)
    Room toEntity(RoomRequestDTO roomRequestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cinema", ignore = true)
    @Mapping(target = "showtimes", ignore = true)
    void updateFromDto(RoomRequestDTO dto, @MappingTarget Room entity);
}