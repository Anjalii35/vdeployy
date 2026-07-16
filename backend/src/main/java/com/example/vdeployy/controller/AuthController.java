package com.example.vdeployy.controller;

import com.example.vdeployy.dtos.LoginReq;
import com.example.vdeployy.dtos.RegisterReq;
import com.example.vdeployy.dtos.UserResp;
import com.example.vdeployy.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResp> register(@Valid @RequestBody RegisterReq request){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginReq request){
        return ResponseEntity.ok(authService.login(request));
    }

}
