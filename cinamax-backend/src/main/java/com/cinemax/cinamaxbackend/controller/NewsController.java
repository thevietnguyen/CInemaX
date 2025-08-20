package com.cinemax.cinamaxbackend.controller;

import com.cinemax.cinamaxbackend.dto.News.NewsResponseDTO;
import com.cinemax.cinamaxbackend.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;


@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;

    @GetMapping
    public Page<NewsResponseDTO> getNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return newsService.getPublishedNews(pageable, query, category);
    }

    @GetMapping("/categories")
    public Map<String, String> getCategories() {
        return newsService.getAllCategories();
    }

    @GetMapping("/recent")
    public List<NewsResponseDTO> getRecentNews() {
        return newsService.getRecentNews(3);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        try {
            NewsResponseDTO news = newsService.getPublishedNewsById(id);
            return ResponseEntity.ok(news);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
