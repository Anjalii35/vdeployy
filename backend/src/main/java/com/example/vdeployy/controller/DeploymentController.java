package com.example.vdeployy.controller;

import com.example.vdeployy.dtos.DeployResp;
import com.example.vdeployy.service.DeploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/deployments")
public class DeploymentController {

    @Autowired
    private DeploymentService deploymentService;

    // Trigger new deployment for a project
    @PostMapping("/{projectId}")
    public ResponseEntity<DeployResp> deploy(@PathVariable Long projectId) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(deploymentService.deploy(projectId));
    }

    // Get all deployments for a project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DeployResp>> getByProject(@PathVariable Long projectId,
                                                         @RequestParam(defaultValue = "0") int pageNo,
                                                         @RequestParam(defaultValue = "5") int pageSize){
        return ResponseEntity.ok(deploymentService.getProjDeployments(projectId, pageNo, pageSize));
    }

    // Get one deployment by id
    @GetMapping("/{id}")
    public ResponseEntity<DeployResp> getDeployment(@PathVariable Long id){
        return ResponseEntity.ok(deploymentService.getDeployment(id));
    }

    // Delete deployment
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDeployment(@PathVariable Long id){
        deploymentService.deleteDeployment(id);
        return ResponseEntity.ok("Deployment Deleted Succeessfully !!");
    }
}
