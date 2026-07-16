package com.example.vdeployy.dtos;

import com.example.vdeployy.enums.Role;

import java.time.LocalDateTime;

public record UserResp(
        Long id,
        String name,
        String email,
        Role role,
        LocalDateTime createdAt
) {
}
