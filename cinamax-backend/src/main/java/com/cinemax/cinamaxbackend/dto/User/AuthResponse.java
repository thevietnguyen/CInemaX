package com.cinemax.cinamaxbackend.dto.User;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private UserDTO user;
}
