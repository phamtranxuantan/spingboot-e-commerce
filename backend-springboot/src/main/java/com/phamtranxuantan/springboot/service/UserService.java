package com.phamtranxuantan.springboot.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.payloads.UserResponse;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);

    UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserDTO getUserById(Long userId);

    UserDTO updateUser(Long userId, UserDTO userDTO);

    String deleteUser(Long userId);

    UserDTO getUserByEmail(String email);

    UserDTO updateUserImage(Long userId, MultipartFile image) throws IOException;

    InputStream getUserImage(String fileName) throws FileNotFoundException;

    UserDTO updateUserByEmail(String email, UserDTO userDTO);

    UserDTO updateUserImageByEmail(String email, MultipartFile image) throws IOException;

    void changePassword(String email, String newPassword);
}