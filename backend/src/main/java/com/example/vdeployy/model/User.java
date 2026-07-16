package com.example.vdeployy.model;

import com.example.vdeployy.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;   // default every new user to USER

    private LocalDateTime createdAt = LocalDateTime.now();

}
