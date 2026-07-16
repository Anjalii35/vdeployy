package com.example.vdeployy.dtos;

import java.time.LocalDateTime;

public record ProjectResp(
        Long id,
        String projectName,
        String githubUrl,
        LocalDateTime createdAt
) {
}
