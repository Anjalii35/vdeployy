package com.example.vdeployy.model;

import com.example.vdeployy.enums.Status;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "deployments")
@Data
public class Deployment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Status status;
    private String githubUrl;

    @Column(columnDefinition = "TEXT")
    private String logs;
    private String liveUrl;
    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
