// dto/Room/RoomRequestDTO.java
package com.cinemax.cinamaxbackend.dto.Room;

import com.cinemax.cinamaxbackend.enums.ScreenType; // Thêm import
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomRequestDTO {
    @NotBlank(message = "Tên phòng không được để trống")
    @Size(max = 100)
    private String name;

    @NotNull(message = "Sức chứa không được để trống")
    @Positive(message = "Sức chứa phải là số dương")
    private Integer capacity;

    // THÊM 2 TRƯỜNG MỚI
    private ScreenType screenType;
    private Boolean isActive;
}