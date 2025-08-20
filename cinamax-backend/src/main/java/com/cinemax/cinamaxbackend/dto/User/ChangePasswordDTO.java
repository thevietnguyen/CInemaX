package com.cinemax.cinamaxbackend.dto.User;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ChangePasswordDTO {

    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;

    @NotBlank(message = "Vui lòng xác nhận mật khẩu mới")
    private String confirmPassword;
}
