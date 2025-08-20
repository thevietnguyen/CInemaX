package com.cinemax.cinamaxbackend.dto.User;

import lombok.*;

import java.time.LocalDate;

@Data
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;
    private LocalDate joinDate;
}

