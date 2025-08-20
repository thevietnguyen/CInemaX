package com.cinemax.cinamaxbackend.service;

import com.cinemax.cinamaxbackend.dto.User.AuthResponse;
import com.cinemax.cinamaxbackend.dto.User.LoginRequest;
import com.cinemax.cinamaxbackend.dto.User.RegisterRequest;
import com.cinemax.cinamaxbackend.entity.User;
import com.cinemax.cinamaxbackend.enums.Role;
import com.cinemax.cinamaxbackend.mapper.UserMapper;
import com.cinemax.cinamaxbackend.repository.UserRepository;
import com.cinemax.cinamaxbackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;


    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        User user = new User();
        user.setFullName(request.getFullname());;
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setJoinDate(LocalDate.now());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(userMapper.toDTO(user));
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail( request.getEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getEmail()).orElse(null));
        if (user == null) throw new RuntimeException("Tài khoản không tồn tại");

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }
        String token = jwtUtil.generateToken(user);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(userMapper.toDTO(user));
        return response;
    }
}

