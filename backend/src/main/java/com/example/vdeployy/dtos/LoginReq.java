package com.example.vdeployy.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginReq (
        @NotBlank(message = "Email is Required")
        @Email(message = "Enter a Valid Email")
        String email,
        @NotBlank(message = "Password is Required")
        String password
){
}
