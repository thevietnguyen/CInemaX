package com.cinemax.cinamaxbackend.mapper;

import com.cinemax.cinamaxbackend.dto.User.UserDTO;
import com.cinemax.cinamaxbackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);
}
