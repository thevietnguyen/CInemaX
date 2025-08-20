package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.News.NewsRequestDTO;
import com.cinemax.cinamaxbackend.dto.News.NewsResponseDTO;
import com.cinemax.cinamaxbackend.entity.News;
import com.cinemax.cinamaxbackend.enums.NewsCategory;
import com.cinemax.cinamaxbackend.mapper.NewsMapper;
import com.cinemax.cinamaxbackend.repository.NewsRepository;
import com.cinemax.cinamaxbackend.service.NewsService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;

    @Override
    public Page<NewsResponseDTO> getAllNews(Pageable pageable, String query) {
        Specification<News> spec = (root, q, cb) -> {
            if (StringUtils.hasText(query)) {
                // Tìm kiếm theo tiêu đề
                return cb.like(cb.lower(root.get("title")), "%" + query.toLowerCase() + "%");
            }
            return cb.conjunction(); // Trả về true nếu không có query
        };
        return newsRepository.findAll(spec, pageable).map(newsMapper::toResponseDTO);
    }

    @Override
    public NewsResponseDTO getNewsById(Long id) {
        News news = newsRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));
        return newsMapper.toResponseDTO(news);
    }

    @Override
    public NewsResponseDTO createNews(NewsRequestDTO newsRequestDTO) {
        News news = newsMapper.toEntity(newsRequestDTO);
        News savedNews = newsRepository.save(news);
        return newsMapper.toResponseDTO(savedNews);
    }

    @Override
    @Transactional
    public NewsResponseDTO updateNews(Long id, NewsRequestDTO newsRequestDTO) {
        News existingNews = newsRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));
        newsMapper.updateEntityFromDto(newsRequestDTO, existingNews);
        News updatedNews = newsRepository.save(existingNews);
        return newsMapper.toResponseDTO(updatedNews);
    }

    @Override
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new RuntimeException("Bài viết không tồn tại");
        }
        newsRepository.deleteById(id);
    }

    @Override
    public Page<NewsResponseDTO> getPublishedNews(Pageable pageable, String query, String categoryValue) {
        Specification<News> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), "published"));

            if (StringUtils.hasText(query)) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + query.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(categoryValue)) {
                try {
                    NewsCategory categoryEnum = NewsCategory.fromValue(categoryValue);
                    predicates.add(cb.equal(root.get("category"), categoryEnum));
                } catch (IllegalArgumentException e) {
                    predicates.add(cb.disjunction());
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return newsRepository.findAll(spec, pageable).map(newsMapper::toResponseDTO);
    }

    @Override
    public Map<String, String> getAllCategories() {
        return Arrays.stream(NewsCategory.values())
                .collect(Collectors.toMap(NewsCategory::getValue, NewsCategory::getDisplayName));
    }

    @Override
    public List<NewsResponseDTO> getRecentNews(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return newsRepository.findAll(pageable).stream()
                .filter(news -> "published".equalsIgnoreCase(news.getStatus()))
                .map(newsMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NewsResponseDTO getPublishedNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));
        if (!"published".equalsIgnoreCase(news.getStatus())) {
            throw new RuntimeException("Bài viết này không tồn tại hoặc chưa được xuất bản.");
        }

        return newsMapper.toResponseDTO(news);
    }
}