package com.example.vdeployy.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ProjectReq(
        @NotBlank(message = "Project name is Required")
        String projectName,
        @NotBlank(message = "GitHub URL is Required")
        @Pattern(regexp = "^https://github\\.com/.+", message = "Must be a valid GitHub URL")
        String githubUrl
) {
}
