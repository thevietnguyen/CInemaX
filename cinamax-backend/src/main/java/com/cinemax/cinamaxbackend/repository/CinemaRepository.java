package com.cinemax.cinamaxbackend.repository;

import com.cinemax.cinamaxbackend.entity.Cinema;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CinemaRepository extends JpaRepository<Cinema, Long>, JpaSpecificationExecutor<Cinema> {
    @Override
    @EntityGraph(attributePaths = {"rooms"})
    List<Cinema> findAll();
}
