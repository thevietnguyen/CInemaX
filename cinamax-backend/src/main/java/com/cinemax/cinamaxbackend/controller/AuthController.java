package com.cinemax.cinamaxbackend.controller;

import com.cinemax.cinamaxbackend.dto.User.AuthResponse;
import com.cinemax.cinamaxbackend.dto.User.LoginRequest;
import com.cinemax.cinamaxbackend.dto.User.RegisterRequest;
import com.cinemax.cinamaxbackend.entity.User;
import com.cinemax.cinamaxbackend.enums.Role;
import com.cinemax.cinamaxbackend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://127.0.0.1:3000/index.html")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }





    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
//        User user = User.builder()
//                .username("test")
//                .role(Role.USER)
//                .build();
//
//        System.out.println(user.getUsername());
//        System.out.println(user.getRole());
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

