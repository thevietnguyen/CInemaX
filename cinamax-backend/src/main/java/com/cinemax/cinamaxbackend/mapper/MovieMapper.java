package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.Movie.MovieRequestDTO;
import com.cinemax.cinamaxbackend.dto.Movie.MovieResponseDTO;
import com.cinemax.cinamaxbackend.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    @Mapping(target = "id", ignore = true)
    Movie toEntity(MovieRequestDTO dto);
    MovieResponseDTO toResponseDTO(Movie entity);
    void updateEntityFromDto(MovieRequestDTO dto, @MappingTarget Movie entity);
}