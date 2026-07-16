package com.example.vdeployy.service;

import com.example.vdeployy.enums.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String SECRET;

    public String generateToken(String email, String name, Role role){

        return Jwts.builder()
                .setSubject(email)
                .claim("name", name)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public String extractEmail(String token){

        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String extractRole(String token){

        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token){
        try{
            extractEmail(token);
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

}
