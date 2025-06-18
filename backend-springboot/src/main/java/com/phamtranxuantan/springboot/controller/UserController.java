package com.phamtranxuantan.springboot.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.config.AppConstants;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.payloads.UserResponse;
import com.phamtranxuantan.springboot.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping("/admin/users")
  public ResponseEntity<UserResponse> getUsers(
      @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
      @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
      @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
      @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
    UserResponse userResponse = userService.getAllUsers(pageNumber, pageSize, sortBy,
        sortOrder);
    return new ResponseEntity<UserResponse>(userResponse, HttpStatus.OK);
  }

  @DeleteMapping("/admin/users/{userId}")
  public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
    String status = userService.deleteUser(userId);
    return new ResponseEntity<String>(status, HttpStatus.OK);
  }

  // api/users
  @GetMapping("/public/users/{email}")
  public ResponseEntity<UserDTO> getUser(@PathVariable String email) {
    UserDTO user = userService.getUserByEmail(email);
    return new ResponseEntity<UserDTO>(user, HttpStatus.FOUND);
  }

  @PutMapping("/public/users/{email}")
  public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO, @PathVariable String email) {
    UserDTO updatedUser = userService.updateUserByEmail(email, userDTO);
    return new ResponseEntity<UserDTO>(updatedUser, HttpStatus.OK);
  }

  @GetMapping("/public/users/email/{email}")
  public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
    UserDTO user = userService.getUserByEmail(email);
    return new ResponseEntity<UserDTO>(user, HttpStatus.OK);
  }

  @PutMapping("/public/users/{email}/imageUser")
  public ResponseEntity<UserDTO> updateUserImage(@PathVariable String email,
      @RequestParam("imageUser") MultipartFile image)
      throws IOException {
    UserDTO updatedUser = userService.updateUserImageByEmail(email, image);
    return new ResponseEntity<UserDTO>(updatedUser, HttpStatus.OK);
  }

  @GetMapping("/public/users/imageUser/{fileName}")
  public ResponseEntity<InputStreamResource> getUserImage(@PathVariable String fileName) throws FileNotFoundException {
    InputStream imageStream = userService.getUserImage(fileName);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_PNG);
    headers.setContentDispositionFormData("inline", fileName);
    return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
  }

  @PatchMapping("/public/users/{email}/changePassword")
  public ResponseEntity<String> changePassword(@PathVariable String email, @RequestParam String newPassword) {
    userService.changePassword(email, newPassword);
    return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
  }

}