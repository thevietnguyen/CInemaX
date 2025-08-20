// service/impl/CinemaServiceImpl.java
package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.Cinema.CinemaRequestDTO;
import com.cinemax.cinamaxbackend.dto.Cinema.CinemaResponseDTO;
import com.cinemax.cinamaxbackend.entity.Cinema;
import com.cinemax.cinamaxbackend.mapper.CinemaMapper;
import com.cinemax.cinamaxbackend.repository.CinemaRepository;
import com.cinemax.cinamaxbackend.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final CinemaMapper cinemaMapper;
    // RoomMapper không còn cần thiết trong hàm updateCinema đơn giản này

    @Override
    @Transactional
    public CinemaResponseDTO createCinema(CinemaRequestDTO requestDTO) {
        // Logic tạo mới vẫn giữ nguyên, vì rạp mới chưa có suất chiếu
        Cinema cinema = cinemaMapper.toEntity(requestDTO);
        if (cinema.getRooms() != null) {
            cinema.getRooms().forEach(room -> room.setCinema(cinema));
        }
        Cinema savedCinema = cinemaRepository.save(cinema);
        return cinemaMapper.toResponseDTO(savedCinema);
    }

    /**
     * **HÀM ĐÃ ĐƯỢC SỬA LẠI ĐỂ AN TOÀN HƠN**
     * Hàm này giờ chỉ cập nhật thông tin cơ bản của rạp phim.
     * Nó sẽ không còn cố gắng xóa các phòng chiếu đang tồn tại.
     */
    @Override
    @Transactional
    public CinemaResponseDTO updateCinema(Long id, CinemaRequestDTO requestDTO) {
        Cinema existingCinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rạp phim không tồn tại"));

        existingCinema.setName(requestDTO.getName());
        existingCinema.setAddress(requestDTO.getAddress());
        existingCinema.setCity(requestDTO.getCity());

        Cinema updatedCinema = cinemaRepository.save(existingCinema);
        return cinemaMapper.toResponseDTO(updatedCinema);
    }

    @Override
    public void deleteCinema(Long id) {
        // Lưu ý: Việc xóa rạp cũng sẽ gặp lỗi tương tự nếu rạp đó có phòng đang được sử dụng.
        // Cần có logic kiểm tra trước khi xóa.
        cinemaRepository.deleteById(id);
    }

    @Override
    public Page<CinemaResponseDTO> getAllCinemas(Pageable pageable, String query) {
        Specification<Cinema> spec = (root, q, cb) -> {
            if (StringUtils.hasText(query)) {
                return cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%");
            }
            return cb.conjunction();
        };
        Page<Cinema> cinemaPage = cinemaRepository.findAll(spec, pageable);
        return cinemaPage.map(cinemaMapper::toResponseDTO);
    }

    @Override
    public List<CinemaResponseDTO> getAllCinemasWithRooms() {
        return cinemaRepository.findAll().stream()
                .map(cinemaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CinemaResponseDTO getCinemaById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rạp phim không tồn tại với ID: " + id));
        return cinemaMapper.toResponseDTO(cinema);
    }
}