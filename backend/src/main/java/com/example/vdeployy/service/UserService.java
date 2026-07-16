package com.example.vdeployy.service;

import com.example.vdeployy.dtos.DeployResp;
import com.example.vdeployy.dtos.ProjectResp;
import com.example.vdeployy.dtos.UserResp;
import com.example.vdeployy.model.Deployment;
import com.example.vdeployy.model.Project;
import com.example.vdeployy.model.User;
import com.example.vdeployy.repo.DeploymentRepo;
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
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private DeploymentRepo deploymentRepo;

    public UserResp getMe(){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));

        return new UserResp(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }

    public List<UserResp> getAllUsers(){

        List<User> users = userRepo.findAll();

        return users.stream()
                .map(user -> new UserResp(
                        user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt()
                ))
                .toList();
    }

    public void deleteUser(Long id){

        userRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
        userRepo.deleteById(id);
    }

    public List<ProjectResp> getAllProjects(int pageNo, int pageSize){

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Project> projects = projectRepo.findAll(pageable);

        return projects.getContent()
                .stream()
                .map(project -> new ProjectResp(
                        project.getId(), project.getProjectName(), project.getGithubUrl(), project.getCreatedAt()
                ))
                .toList();
    }

    public List<DeployResp> getAllDeployments(int pageNo, int pageSize){

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Deployment> deployments = deploymentRepo.findAll(pageable);

        return deployments.getContent()
                .stream()
                .map(deploy -> new DeployResp(
                        deploy.getId(), deploy.getStatus(), deploy.getGithubUrl(), deploy.getLogs(),
                        deploy.getLiveUrl(), deploy.getStartedAt(), deploy.getCompletedAt()
                ))
                .toList();
    }

}
