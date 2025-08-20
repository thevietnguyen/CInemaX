package com.cinemax.cinamaxbackend.dto.Movie;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.URL;
import java.time.LocalDate;

@Data
public class MovieRequestDTO {
    @NotBlank(message = "Tên phim không được để trống")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotBlank(message = "Thể loại không được để trống")
    private String genres;

    @Positive(message = "Thời lượng phim phải là số dương")
    private int durationInMinutes;

    @URL(message = "URL poster không hợp lệ")
    private String posterUrl;

    @URL(message = "URL trailer không hợp lệ")
    private String trailerUrl;

    @NotNull(message = "Ngày phát hành không được để trống")
    private LocalDate releaseDate;

    @Pattern(regexp = "^(?i)(NOW_SHOWING|COMING_SOON|ENDED)$", message = "Trạng thái không hợp lệ")
    @NotBlank
    private String status;
}