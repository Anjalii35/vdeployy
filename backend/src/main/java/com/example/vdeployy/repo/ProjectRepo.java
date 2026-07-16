package com.example.vdeployy.repo;

import com.example.vdeployy.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepo extends JpaRepository<Project, Long> {

    Page<Project> findByUserId(Long userid, Pageable pageable);

}
