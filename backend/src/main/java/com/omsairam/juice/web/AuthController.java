package com.omsairam.juice.web;

import com.omsairam.juice.dto.Dtos.AuthResponse;
import com.omsairam.juice.dto.Dtos.LoginRequest;
import com.omsairam.juice.dto.Dtos.ProfileRequest;
import com.omsairam.juice.dto.Dtos.RegisterRequest;
import com.omsairam.juice.dto.Dtos.UserDto;
import com.omsairam.juice.security.UserPrincipal;
import com.omsairam.juice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return auth.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return auth.login(req);
    }

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal UserPrincipal me) {
        return auth.me(me.id());
    }

    @PutMapping("/me")
    public UserDto updateMe(@AuthenticationPrincipal UserPrincipal me, @Valid @RequestBody ProfileRequest req) {
        return auth.updateProfile(me.id(), req);
    }
}
