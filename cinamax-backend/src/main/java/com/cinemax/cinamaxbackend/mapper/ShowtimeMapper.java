package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.Showtime.ShowtimeResponseDTO;
import com.cinemax.cinamaxbackend.entity.Showtime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {

    // **SỬA LẠI CÁC MAPPING Ở ĐÂY**
    @Mapping(source = "movie.id", target = "movieId")
    @Mapping(source = "movie.title", target = "movieTitle") // Lấy title từ movie
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "room.name", target = "roomName")     // Lấy name từ room
    @Mapping(source = "room.cinema.name", target = "cinemaName")
    ShowtimeResponseDTO toDto(Showtime showtime);
}

