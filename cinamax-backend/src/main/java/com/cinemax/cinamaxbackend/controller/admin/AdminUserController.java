package com.cinemax.cinamaxbackend.controller.admin;

import com.cinemax.cinamaxbackend.dto.Movie.MovieRequestDTO;
import com.cinemax.cinamaxbackend.dto.Movie.MovieResponseDTO;
import com.cinemax.cinamaxbackend.dto.User.UpdateUserRoleDTO;
import com.cinemax.cinamaxbackend.dto.User.UserDTO;
import com.cinemax.cinamaxbackend.entity.User;
import com.cinemax.cinamaxbackend.mapper.UserMapper;
import com.cinemax.cinamaxbackend.repository.UserRepository;
import com.cinemax.cinamaxbackend.service.MovieService;
import com.cinemax.cinamaxbackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;


//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public Page<UserDTO> getAllUsers(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        return userService.getAllUsers(page, size);
//    }


    @GetMapping
    public Page<UserDTO> getAllOrSearchUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query
    ) {
        if (query != null && !query.trim().isEmpty()) {
            return userService.searchUsers(query, page, size);
        }
        return userService.getAllUsers(page, size);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleDTO updateUserRoleDTO) {
        UserDTO updatedUser = userService.updateUserRole(id, updateUserRoleDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
