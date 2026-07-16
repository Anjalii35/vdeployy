package com.example.vdeployy.service;

import com.example.vdeployy.dtos.ProjectReq;
import com.example.vdeployy.dtos.ProjectResp;
import com.example.vdeployy.enums.Role;
import com.example.vdeployy.model.Project;
import com.example.vdeployy.model.User;
import com.example.vdeployy.repo.ProjectRepo;
import com.example.vdeployy.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));
    }

    public ProjectResp createProject(ProjectReq projectReq){
        User user = getCurrentUser();

        Project project = new Project();
        project.setProjectName(projectReq.projectName());
        project.setGithubUrl(projectReq.githubUrl());
        project.setUser(user);
        Project saved = projectRepo.save(project);

        return new ProjectResp(saved.getId(), saved.getProjectName(), saved.getGithubUrl(), saved.getCreatedAt());
    }

    public List<ProjectResp> getUserProjects(int pageNo, int pageSize){
        User user = getCurrentUser();

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Project> projects = projectRepo.findByUserId(user.getId(), pageable);

        return projects.getContent()
                .stream()
                .map(project -> new ProjectResp(
                        project.getId(), project.getProjectName(), project.getGithubUrl(), project.getCreatedAt()
                ))
                .toList();
    }

    public ProjectResp getProject(Long id){

        User user = getCurrentUser();
        Project project = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project Not Found"));

        if(user.getRole() != Role.ADMIN && !project.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your Project");
        }

        return new ProjectResp(
                project.getId(), project.getProjectName(), project.getGithubUrl(), project.getCreatedAt()
        );
    }

    public ProjectResp updateProject(Long id, ProjectReq req){
        User user = getCurrentUser();

        Project project = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project Not Found"));

        if(user.getRole() != Role.ADMIN && !project.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your Project");
        }

        if(req.projectName() != null){
            project.setProjectName(req.projectName());
        }
        if(req.githubUrl() != null){
            project.setGithubUrl(req.githubUrl());
        }
        Project saved = projectRepo.save(project);

        return new ProjectResp(
                saved.getId(), saved.getProjectName(), saved.getGithubUrl(), saved.getCreatedAt()
        );
    }

    public void deleteProject(Long id){
        User user = getCurrentUser();

        Project project = projectRepo.findById(id).orElseThrow(() -> new RuntimeException("Project Not Found"));

        if(user.getRole() != Role.ADMIN && !project.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access Denied: Not your Project");
        }

        projectRepo.deleteById(id);
    }
}