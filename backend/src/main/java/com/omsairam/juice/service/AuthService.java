package com.omsairam.juice.service;

import com.omsairam.juice.dto.Dtos.AuthResponse;
import com.omsairam.juice.dto.Dtos.LoginRequest;
import com.omsairam.juice.dto.Dtos.ProfileRequest;
import com.omsairam.juice.dto.Dtos.RegisterRequest;
import com.omsairam.juice.dto.Dtos.UserDto;
import com.omsairam.juice.model.AppUser;
import com.omsairam.juice.model.Role;
import com.omsairam.juice.repo.UserRepository;
import com.omsairam.juice.security.JwtService;
import com.omsairam.juice.web.ApiException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public static UserDto toDto(AppUser u) {
        return new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getMobile(), u.getAddress(), u.getRole().name());
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        String mobile = req.mobile().trim();
        if (users.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("An account with this email already exists.");
        }
        if (users.existsByMobile(mobile)) {
            throw ApiException.conflict("An account with this mobile number already exists.");
        }
        AppUser user = new AppUser();
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setMobile(mobile);
        user.setAddress(req.address().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setRole(Role.CUSTOMER); // an admin can never be created through the public API
        users.save(user);
        return new AuthResponse(jwt.create(user), toDto(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        String id = req.identifier().trim();
        AppUser user = (id.contains("@") ? users.findByEmailIgnoreCase(id) : users.findByMobile(id)).orElse(null);
        if (user == null || !encoder.matches(req.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email/mobile or password.");
        }
        return new AuthResponse(jwt.create(user), toDto(user));
    }

    @Transactional(readOnly = true)
    public UserDto me(Long userId) {
        return toDto(find(userId));
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileRequest req) {
        AppUser user = find(userId);
        String email = req.email().trim().toLowerCase();
        String mobile = req.mobile().trim();
        users.findByEmailIgnoreCase(email).filter(o -> !o.getId().equals(userId)).ifPresent(o -> {
            throw ApiException.conflict("This email is already used by another account.");
        });
        users.findByMobile(mobile).filter(o -> !o.getId().equals(userId)).ifPresent(o -> {
            throw ApiException.conflict("This mobile number is already used by another account.");
        });
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setMobile(mobile);
        user.setAddress(req.address().trim());
        return toDto(users.save(user));
    }

    private AppUser find(Long id) {
        return users.findById(id).orElseThrow(() -> ApiException.unauthorized("Please login again."));
    }
}
