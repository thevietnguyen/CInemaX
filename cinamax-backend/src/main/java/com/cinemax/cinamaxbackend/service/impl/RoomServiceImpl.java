// service/impl/RoomServiceImpl.java
package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.Room.RoomDTO;
import com.cinemax.cinamaxbackend.dto.Room.RoomRequestDTO;
import com.cinemax.cinamaxbackend.entity.Cinema;
import com.cinemax.cinamaxbackend.entity.Room;
import com.cinemax.cinamaxbackend.mapper.RoomMapper;
import com.cinemax.cinamaxbackend.repository.CinemaRepository;
import com.cinemax.cinamaxbackend.repository.RoomRepository;
import com.cinemax.cinamaxbackend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final CinemaRepository cinemaRepository;
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getRoomsByCinemaId(Long cinemaId) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp phim với ID: " + cinemaId));

        return cinema.getRooms().stream()
                .map(roomMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDTO createRoom(Long cinemaId, RoomRequestDTO requestDTO) {
        Cinema cinema = cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp phim để thêm phòng."));

        Room newRoom = roomMapper.toEntity(requestDTO);
        newRoom.setCinema(cinema); // Thiết lập mối quan hệ

        Room savedRoom = roomRepository.save(newRoom);
        return roomMapper.toDto(savedRoom);
    }

    @Override
    public RoomDTO updateRoom(Long roomId, RoomRequestDTO requestDTO) {
        Room existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng chiếu."));

        roomMapper.updateFromDto(requestDTO, existingRoom);

        Room updatedRoom = roomRepository.save(existingRoom);
        return roomMapper.toDto(updatedRoom);
    }

    @Override
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng chiếu."));

        // **Logic an toàn:** Kiểm tra xem phòng có suất chiếu nào không trước khi xóa
        if (!room.getShowtimes().isEmpty()) {
            throw new IllegalStateException("Không thể xóa phòng này vì vẫn còn suất chiếu được lên lịch.");
        }

        roomRepository.delete(room);
    }
}