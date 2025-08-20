package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.Seat.SeatRequestDTO;
import com.cinemax.cinamaxbackend.dto.Seat.SeatResponseDTO;
import com.cinemax.cinamaxbackend.entity.Room;
import com.cinemax.cinamaxbackend.entity.Seat;
import com.cinemax.cinamaxbackend.mapper.SeatMapper;
import com.cinemax.cinamaxbackend.repository.RoomRepository;
import com.cinemax.cinamaxbackend.repository.SeatRepository;
import com.cinemax.cinamaxbackend.service.SeatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepo;
    private final RoomRepository roomRepo;
    private final SeatMapper mapper;

    public SeatServiceImpl(SeatRepository seatRepo, RoomRepository roomRepo, SeatMapper mapper) {
        this.seatRepo = seatRepo;
        this.roomRepo = roomRepo;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatResponseDTO> listByRoom(Long roomId) {
        return seatRepo.findByRoomId(roomId).stream().map(mapper::toDto).toList();
    }

    @Override
    public SeatResponseDTO create(SeatRequestDTO dto) {
        Room room = roomRepo.findById(dto.roomId()).orElseThrow();
        if (seatRepo.existsByRoomIdAndRowLabelAndSeatNumber(room.getId(), dto.rowLabel(), dto.seatNumber())) {
            throw new IllegalArgumentException("Seat exists in room");
        }
        Seat s = new Seat();
        s.setRoom(room);
        s.setRowLabel(dto.rowLabel());
        s.setSeatNumber(dto.seatNumber());
        s.setType(dto.type());
        return mapper.toDto(seatRepo.save(s));
    }

    @Override
    public void delete(Long id) {
        seatRepo.deleteById(id);
    }
}
