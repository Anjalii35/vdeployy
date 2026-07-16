package com.example.vdeployy.repo;

import com.example.vdeployy.model.Deployment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeploymentRepo extends JpaRepository<Deployment, Long> {

    Page<Deployment> findByProjectId(Long projectId, Pageable pageable);
}
