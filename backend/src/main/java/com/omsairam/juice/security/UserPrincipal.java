package com.omsairam.juice.security;

import com.omsairam.juice.model.Role;

/** The logged-in user as seen by controllers (@AuthenticationPrincipal). */
public record UserPrincipal(Long id, String email, Role role) {}
