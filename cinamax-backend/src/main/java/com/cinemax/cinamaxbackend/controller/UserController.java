package com.cinemax.cinamaxbackend.controller;


import com.cinemax.cinamaxbackend.dto.User.ChangePasswordDTO;
import com.cinemax.cinamaxbackend.dto.User.UpdateUserDTO;
import com.cinemax.cinamaxbackend.dto.User.UserDTO;
import com.cinemax.cinamaxbackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUserInfo());
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@Valid @RequestBody UpdateUserDTO updateUserDTO) {
        UserDTO updatedUser = userService.updateCurrentUser(updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/password-change")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        userService.changeCurrentUserPassword(changePasswordDTO);
        // Trả về một JSON đơn giản để xác nhận thành công
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
    }
}
