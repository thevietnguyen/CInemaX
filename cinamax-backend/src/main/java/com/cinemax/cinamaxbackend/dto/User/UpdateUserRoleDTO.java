package com.cinemax.cinamaxbackend.dto.User;

import jakarta.validation.constraints.*;

import lombok.Data;


@Data
public class UpdateUserRoleDTO {
    @Pattern(regexp = "^(?i)(USER|ADMIN)$", message = "Vai trò không hợp lệ. Chỉ chấp nhận USER hoặc ADMIN.")
    private String role;
}