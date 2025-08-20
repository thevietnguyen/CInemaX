// mapper/NewsMapper.java
package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.News.NewsRequestDTO;
import com.cinemax.cinamaxbackend.dto.News.NewsResponseDTO;
import com.cinemax.cinamaxbackend.entity.News;
import com.cinemax.cinamaxbackend.enums.NewsCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface NewsMapper {
    @Mapping(source = "category", target = "category", qualifiedByName = "categoryEnumValue")
    NewsResponseDTO toResponseDTO(News news);

    @Mapping(source = "category", target = "category", qualifiedByName = "stringToCategoryEnum")
    News toEntity(NewsRequestDTO newsRequestDTO);

    @Mapping(source = "category", target = "category", qualifiedByName = "stringToCategoryEnum")
    void updateEntityFromDto(NewsRequestDTO dto, @MappingTarget News entity);

    @Named("categoryEnumValue")
    default String categoryEnumValue(NewsCategory category) {
        if (category == null) {
            return null;
        }
        return category.getValue();
    }

    @Named("stringToCategoryEnum")
    default NewsCategory stringToCategoryEnum(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return NewsCategory.fromValue(value);
    }
}