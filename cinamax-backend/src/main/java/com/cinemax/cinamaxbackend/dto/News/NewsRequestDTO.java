package com.cinemax.cinamaxbackend.dto.News;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NewsRequestDTO {
    @NotEmpty(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String title;

    @NotEmpty(message = "Nội dung không được để trống")
    private String content;

    private String category;
    private String thumbnail;
    private String status;
}
