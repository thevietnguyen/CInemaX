package com.cinemax.cinamaxbackend.repository;

import com.cinemax.cinamaxbackend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
