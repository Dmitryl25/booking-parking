package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RefreshTokenRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static java.util.Objects.isNull;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        AuthResponse ans;
        try{
            ans =  authService.login(request);
        }
        catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(ans);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {
        AuthResponse ans;
        try{
            ans =  authService.refreshToken(request);
            if (isNull(ans.getRefreshToken()) || ans.getRefreshToken().isEmpty()) {
                return new ResponseEntity<>("Пропущен рефреш-токен или передан null", HttpStatus.BAD_REQUEST);
            }
        }
        catch (RuntimeException e){
            return new ResponseEntity<>("Неверный или истекший рефреш-токен", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(ans);
    }

}