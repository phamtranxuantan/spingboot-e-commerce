package com.phamtranxuantan.springboot.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.exceptions.UserNotFoundException;
import com.phamtranxuantan.springboot.payloads.LoginCredentials;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.service.UserService;
import com.phamtranxuantan.springboot.sucurity.JWTUtil;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class AuthController {
  @Autowired
  private UserService userService;
  @Autowired
  private JWTUtil jwtUtil;
  @Autowired
  private AuthenticationManager authenticationManager;
  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> registerHandler(@Valid @RequestBody UserDTO user)
      throws UserNotFoundException {
    String encodedPass = passwordEncoder.encode(user.getPassword());
    user.setPassword(encodedPass);
    UserDTO userDTO = userService.registerUser(user);
    String token = jwtUtil.generateToken(userDTO.getEmail());
    return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("jwt-token", token),
        HttpStatus.CREATED);
  }

  @PostMapping("/login")
  public Map<String, Object> loginHandler(@Valid @RequestBody LoginCredentials credentials) {
    UsernamePasswordAuthenticationToken authCredentials = new UsernamePasswordAuthenticationToken(
        credentials.getEmail(), credentials.getPassword());
    authenticationManager.authenticate(authCredentials);
    String token = jwtUtil.generateToken(credentials.getEmail());
   // return Collections.singletonMap("jwt-token", token);
    Map<String, Object> response = new HashMap<>();
    response.put("jwt-token", token);
    response.put("email", credentials.getEmail()); 

    return response;
  }
}