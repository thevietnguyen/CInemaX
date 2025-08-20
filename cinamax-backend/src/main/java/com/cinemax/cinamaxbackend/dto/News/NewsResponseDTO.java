package com.cinemax.cinamaxbackend.dto.News;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NewsResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String thumbnail;
    private String status;
    private LocalDateTime createdAt;
}
