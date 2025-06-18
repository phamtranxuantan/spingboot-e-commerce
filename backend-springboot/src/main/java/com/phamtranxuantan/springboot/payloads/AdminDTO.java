package com.phamtranxuantan.springboot.payloads;

import java.util.Set;

import com.phamtranxuantan.springboot.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String imageUser;
    private String email;
    private Set<Role> roles; // Chỉ lấy thông tin roles
}
