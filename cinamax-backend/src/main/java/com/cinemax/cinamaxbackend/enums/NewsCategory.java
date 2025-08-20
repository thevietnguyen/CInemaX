package com.cinemax.cinamaxbackend.enums;

import lombok.Getter;

@Getter
public enum NewsCategory {
    REVIEW("review", "Bình Luận Phim"),
    STAR_NEWS("star-news", "Tin Tức Sao"),
    BEHIND_THE_SCENES("behind-the-scenes", "Hậu Trường"),
    PROMOTION("promotion", "Khuyến Mãi");

    private final String value;
    private final String displayName;

    NewsCategory(String value, String displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    public static NewsCategory fromValue(String value) {
        for (NewsCategory category : values()) {
            if (category.value.equalsIgnoreCase(value)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy chuyên mục với giá trị: " + value);
    }
}