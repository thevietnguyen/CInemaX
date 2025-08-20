package com.cinemax.cinamaxbackend.service.impl;

import com.cinemax.cinamaxbackend.dto.User.ChangePasswordDTO;
import com.cinemax.cinamaxbackend.dto.User.UpdateUserDTO;
import com.cinemax.cinamaxbackend.dto.User.UpdateUserRoleDTO;
import com.cinemax.cinamaxbackend.dto.User.UserDTO;
import com.cinemax.cinamaxbackend.entity.User;
import com.cinemax.cinamaxbackend.enums.Role;
import com.cinemax.cinamaxbackend.mapper.UserMapper;
import com.cinemax.cinamaxbackend.repository.UserRepository;
import com.cinemax.cinamaxbackend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public Page<UserDTO> getAllUsers(int page, int size) {
        Page<User> userPage = userRepository.findAll(PageRequest.of(page, size));
        return userPage.map(userMapper::toDTO);
    }

    @Override
    public UserDTO getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return userMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateCurrentUser(UpdateUserDTO updateUserDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Lỗi xác thực: Không tìm thấy người dùng."));
        if (updateUserDTO.getFullName() != null && !updateUserDTO.getFullName().isEmpty()) {
            currentUser.setFullName(updateUserDTO.getFullName());
        }

        if (updateUserDTO.getPhoneNumber() != null) {
            currentUser.setPhoneNumber(updateUserDTO.getPhoneNumber());
        }
        User updatedUser = userRepository.save(currentUser);
        return userMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUserRole(Long id, UpdateUserRoleDTO updateUserRoleDTO) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentAdminEmail = authentication.getName();
        if (targetUser.getEmail().equals(currentAdminEmail) &&
                !updateUserRoleDTO.getRole().equalsIgnoreCase("ADMIN")) {
            throw new IllegalArgumentException("Admin không thể tự tước quyền của chính mình.");
        }
        Role newRole = Role.valueOf(updateUserRoleDTO.getRole().toUpperCase());
        targetUser.setRole(newRole);
        User updatedUser = userRepository.save(targetUser);
        return userMapper.toDTO(updatedUser);
    }

    @Override
    @Transactional
    public void changeCurrentUserPassword(ChangePasswordDTO changePasswordDTO) {
        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Lỗi xác thực: Không tìm thấy người dùng."));

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác.");
        }
        currentUser.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentAdminEmail = authentication.getName();
        if (userToDelete.getEmail().equals(currentAdminEmail)) {
            throw new IllegalArgumentException("Admin không thể tự xóa tài khoản của chính mình.");
        }
        userRepository.deleteById(id);
    }

    @Override
    public Page<UserDTO> searchUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable);
        return userPage.map(userMapper::toDTO);
    }
}
