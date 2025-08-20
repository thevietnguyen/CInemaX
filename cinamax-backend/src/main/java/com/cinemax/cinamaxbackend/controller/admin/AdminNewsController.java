// controller/admin/AdminNewsController.java
package com.cinemax.cinamaxbackend.controller.admin;

import com.cinemax.cinamaxbackend.dto.News.NewsRequestDTO;
import com.cinemax.cinamaxbackend.dto.News.NewsResponseDTO;
import com.cinemax.cinamaxbackend.service.NewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/news")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminNewsController {

    private final NewsService newsService;

    @GetMapping
    public Page<NewsResponseDTO> getNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query) {
        Pageable pageable = PageRequest.of(page, size);
        return newsService.getAllNews(pageable, query);
    }

    @PostMapping("/create")
    public ResponseEntity<NewsResponseDTO> createNews(@Valid @RequestBody NewsRequestDTO newsRequestDTO) {
        NewsResponseDTO createdNews = newsService.createNews(newsRequestDTO);
        return new ResponseEntity<>(createdNews, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<NewsResponseDTO> updateNews(@PathVariable Long id, @Valid @RequestBody NewsRequestDTO newsRequestDTO) {
        NewsResponseDTO updatedNews = newsService.updateNews(id, newsRequestDTO);
        return ResponseEntity.ok(updatedNews);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}