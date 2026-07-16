package com.example.vdeployy.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterReq (
        @NotBlank(message = "Name is Required")
        String name,
        @NotBlank(message = "Email is Required")
        @Email(message = "Enter a Valid Email")
        String email,
        @NotBlank(message = "Password is Required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
){
}
