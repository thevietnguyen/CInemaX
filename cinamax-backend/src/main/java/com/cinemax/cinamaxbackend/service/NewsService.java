package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.News.NewsRequestDTO;
import com.cinemax.cinamaxbackend.dto.News.NewsResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface NewsService {
    Page<NewsResponseDTO> getAllNews(Pageable pageable, String query);
    NewsResponseDTO getNewsById(Long id);
    NewsResponseDTO createNews(NewsRequestDTO newsRequestDTO);
    NewsResponseDTO updateNews(Long id, NewsRequestDTO newsRequestDTO);
    void deleteNews(Long id);



    Page<NewsResponseDTO> getPublishedNews(Pageable pageable, String query, String category);
    Map<String, String> getAllCategories();
    List<NewsResponseDTO> getRecentNews(int limit);

    NewsResponseDTO getPublishedNewsById(Long id);
}