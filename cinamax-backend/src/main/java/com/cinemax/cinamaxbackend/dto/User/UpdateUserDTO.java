package com.cinemax.cinamaxbackend.dto.User;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class UpdateUserDTO {

    @Size(min = 2, max = 50, message = "Họ tên phải có độ dài từ 2 đến 50 ký tự")
    private String fullName;

//    @Pattern(regexp = "^(0[3|5|7|8|9])([0-9]{8})$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;
}
