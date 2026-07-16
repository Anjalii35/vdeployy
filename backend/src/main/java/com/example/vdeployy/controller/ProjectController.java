package com.example.vdeployy.controller;

import com.example.vdeployy.dtos.ProjectReq;
import com.example.vdeployy.dtos.ProjectResp;
import com.example.vdeployy.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // Create project
    @PostMapping
    public ResponseEntity<ProjectResp> createProject(@Valid @RequestBody ProjectReq req){
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(req));
    }

    // Get all projects of logged in user
    @GetMapping
    public ResponseEntity<List<ProjectResp>> getUserProjects(@RequestParam(defaultValue = "0") int pageNo,
                                                            @RequestParam(defaultValue = "5") int pageSize){
        return ResponseEntity.ok(projectService.getUserProjects(pageNo, pageSize));
    }

    // Get one project by id
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResp> getOne(@PathVariable Long id){
        return ResponseEntity.ok(projectService.getProject(id));
    }

    // Update Project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResp> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectReq req){
        return ResponseEntity.ok(projectService.updateProject(id, req));
    }

    // Delete Project
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);
        return ResponseEntity.ok("Project Deleted Successfullyy !!");
    }
}
