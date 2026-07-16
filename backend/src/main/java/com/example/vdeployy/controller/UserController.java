package com.example.vdeployy.controller;

import com.example.vdeployy.dtos.DeployResp;
import com.example.vdeployy.dtos.ProjectResp;
import com.example.vdeployy.dtos.UserResp;
import com.example.vdeployy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // get my own profile
    @GetMapping("/users/me")
    public ResponseEntity<UserResp> getMe(){
        return ResponseEntity.ok(userService.getMe());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResp>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // delete a user
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok("User Deleted Successfully !!");
    }

    // Admin only - get all projects of all users
    @GetMapping("/admin/projects")
    public ResponseEntity<List<ProjectResp>> getAllProjects(@RequestParam(defaultValue = "0") int pageNo,
                                                            @RequestParam(defaultValue = "5") int pageSize){
        return ResponseEntity.ok(userService.getAllProjects(pageNo, pageSize));
    }

    // admin only - get all deployments of all projects
    @GetMapping("/admin/deployments")
    public ResponseEntity<List<DeployResp>> getAllDeployments(@RequestParam(defaultValue = "0") int pageNo,
                                                              @RequestParam(defaultValue = "5") int pageSize){
        return ResponseEntity.ok(userService.getAllDeployments(pageNo, pageSize));
    }
}
