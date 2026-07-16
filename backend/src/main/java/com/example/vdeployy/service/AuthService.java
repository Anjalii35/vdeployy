package com.example.vdeployy.service;

import com.example.vdeployy.dtos.LoginReq;
import com.example.vdeployy.dtos.RegisterReq;
import com.example.vdeployy.dtos.UserResp;
import com.example.vdeployy.model.User;
import com.example.vdeployy.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public UserResp register(RegisterReq req){

        if(userRepo.findByEmail(req.email()).isPresent()){
            throw new RuntimeException("Email Already Exists");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));

        User saved = userRepo.save(user);

        return new UserResp(
                saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), saved.getCreatedAt()
        );
    }

    public String login(LoginReq req){

        User user = userRepo.findByEmail(req.email()).orElseThrow(() ->
                new RuntimeException("Invalid Email or Password"));

        boolean isMatch = passwordEncoder.matches(req.password(), user.getPassword());

        if(!isMatch){
            throw new RuntimeException("Invalid Email or Password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getName(), user.getRole());
    }
}
