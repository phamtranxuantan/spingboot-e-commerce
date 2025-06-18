package com.phamtranxuantan.springboot.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.entity.Cart;
import com.phamtranxuantan.springboot.entity.Role;
import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.exceptions.ResourceNotFoundException;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.repository.CartRepo;
import com.phamtranxuantan.springboot.repository.RoleRepo;
import com.phamtranxuantan.springboot.repository.UserRepo;
import com.phamtranxuantan.springboot.service.GoogleService;
import com.phamtranxuantan.springboot.sucurity.JWTUtil;

@RestController
@RequestMapping("/api")
public class GoogleController {

  @Autowired
  private GoogleService googleService;
  @Autowired
  private UserRepo userRepo;
  @Autowired
  private RoleRepo roleRepo;
  @Autowired
  private CartRepo cartRepo;
  @Autowired
  private JWTUtil jwtUtil;

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @GetMapping("/public/oauth2/loginSuccess")
  public ResponseEntity<String> getLoginInfo(OAuth2AuthenticationToken authentication) {
    String email = googleService.processOAuthPostLogin(authentication);
    return new ResponseEntity<String>("User logged in with email: " + email, HttpStatus.OK);
  }

  @GetMapping("/public/oauth2/google")
  public ResponseEntity<Map<String, String>> getGoogleLoginUrl() {
    String googleLoginUrl = googleService.createGoogleLoginUrl();
    Map<String, String> response = new HashMap<>();
    response.put("googleLoginUrl", googleLoginUrl);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @GetMapping("/public/oauth2/callback/google")
  public ResponseEntity<Map<String, Object>> handleGoogleCallback(@RequestParam("code") String authorizationCode) {
    String accessToken = googleService.exchangeCodeForToken(authorizationCode);
    Map<String, Object> userInfo = googleService.getUserInfo(accessToken);
    logger.info("User info received from Google: {}", userInfo);
    UserDTO userDTO = googleService.processOAuthPostLogin(userInfo);

    // Tạo JWT
    User user = userRepo.findByEmail(userDTO.getEmail()).orElse(null);
    if (user == null) {
      // Nếu người dùng chưa tồn tại, lưu vào CSDL
      user = new User();
      user.setEmail(userDTO.getEmail());
      user.setFirstName("chuacapnhat");
      user.setLastName("chuacapnhat");

      // **Lưu user trước để lấy user_id**
      user = userRepo.save(user);

      // **Gán role USER từ bảng role vào bảng user_role**
      Role role = roleRepo.findById(102L)
          .orElseThrow(() -> new ResourceNotFoundException("Role", "id", 102L));
      user.getRoles().add(role);
      user = userRepo.save(user); // Lưu lại user để cập nhật user_role

      // **Tạo giỏ hàng và liên kết với user**
      Cart cart = new Cart();
      cart.setUser(user);
      cart = cartRepo.save(cart);

      user.setCart(cart);
      userRepo.save(user); // Lưu lại user để cập nhật giỏ hàng
    }

    String token = jwtUtil.generateToken(user.getEmail());
    Map<String, Object> response = new HashMap<>();
    response.put("jwt-token", token);
    response.put("email", user.getEmail());
    return new ResponseEntity<>(response, HttpStatus.OK);

    
  }
}