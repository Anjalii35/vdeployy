package com.example.vdeployy.dtos;

import com.example.vdeployy.enums.Status;

import java.time.LocalDateTime;

public record DeployResp(
        Long id,
        Status status,
        String githubUrl,
        String logs,
        String liveUrl,
        LocalDateTime startedAt,
        LocalDateTime completedAt
) {
}
