package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.Showtime.CreateShowtimeDTO;
import com.cinemax.cinamaxbackend.dto.Showtime.UpdateShowtimeDTO;
import com.cinemax.cinamaxbackend.dto.Showtime.ShowtimeResponseDTO;
import com.cinemax.cinamaxbackend.entity.Movie;
import com.cinemax.cinamaxbackend.entity.Room;
import com.cinemax.cinamaxbackend.entity.Showtime;
import com.cinemax.cinamaxbackend.mapper.ShowtimeMapper;
import com.cinemax.cinamaxbackend.repository.MovieRepository;
import com.cinemax.cinamaxbackend.repository.RoomRepository;
import com.cinemax.cinamaxbackend.repository.ShowtimeRepository;
import com.cinemax.cinamaxbackend.service.ShowtimeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository repo;
    private final RoomRepository roomRepo;
    private final MovieRepository movieRepo;
    private final ShowtimeMapper mapper;

    public ShowtimeServiceImpl(ShowtimeRepository repo, RoomRepository roomRepo, MovieRepository movieRepo, ShowtimeMapper mapper) {
        this.repo = repo;
        this.roomRepo = roomRepo;
        this.movieRepo = movieRepo;
        this.mapper = mapper;
    }

    @Override
    public ShowtimeResponseDTO create(CreateShowtimeDTO dto) {
        Room room = roomRepo.findById(dto.roomId()).orElseThrow();
        Movie movie = movieRepo.findById(dto.movieId()).orElseThrow();

        LocalDateTime start = dto.startTime();
        LocalDateTime end = dto.endTime();

        if (!repo.findOverlaps(room.getId(), start, end).isEmpty()) {
            throw new IllegalArgumentException("Showtime overlaps in room");
        }

        Showtime s = new Showtime();
        s.setRoom(room);
        s.setMovie(movie);
        s.setStartTime(start);
        s.setEndTime(end);
        s.setPrice(dto.price());
        s.setStatus(Showtime.Status.SCHEDULED);
        return mapper.toDto(repo.save(s));
    }

    @Override
    public ShowtimeResponseDTO update(Long id, UpdateShowtimeDTO dto) {
        Showtime s = repo.findById(id).orElseThrow();

        LocalDateTime start = dto.startTime();
        LocalDateTime end = dto.endTime();
        if (!repo.findOverlaps(s.getRoom().getId(), start, end).stream()
                .filter(other -> !other.getId().equals(id))
                .toList().isEmpty()) {
            throw new IllegalArgumentException("Showtime overlaps in room");
        }

        s.setStartTime(start);
        s.setEndTime(end);
        if (dto.price() != null) s.setPrice(dto.price());
        if (dto.status() != null) s.setStatus(dto.status());
        return mapper.toDto(repo.save(s));
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ShowtimeResponseDTO get(Long id) {
        return mapper.toDto(repo.findById(id).orElseThrow());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShowtimeResponseDTO> list(Pageable pageable, String query) {
        if (!StringUtils.hasText(query)) {
            return repo.findAll(pageable).map(mapper::toDto);
        }
        Specification<Showtime> spec = (root, q, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + query.toLowerCase() + "%");
        return repo.findAll(pageable).map(mapper::toDto);
    }
}
