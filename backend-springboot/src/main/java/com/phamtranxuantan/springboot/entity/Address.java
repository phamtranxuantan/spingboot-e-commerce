package com.phamtranxuantan.springboot.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
  @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;
    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, message = "Họ tên phải có ít nhất 2 ký tự")
    private String name;

    @Size(min = 10, max = 10, message = "Mobile Number must be exactly 10 digits long")
    @Pattern(regexp = "^\\d{10}$", message = "Mobile Number must contain only Numbers")
    @Column(unique = true, nullable = false)
    private String phone;

    @NotBlank(message = "Tỉnh / Thành phố không được để trống")
    @Size(min = 2, message = "Tỉnh / Thành phố phải có ít nhất 2 ký tự")
    private String province;

    @NotBlank(message = "Quận / Huyện không được để trống")
    @Size(min = 2, message = "Quận / Huyện phải có ít nhất 2 ký tự")
    private String district;

    @NotBlank(message = "Phường / Xã không được để trống")
    @Size(min = 2, message = "Phường / Xã phải có ít nhất 2 ký tự")
    private String ward;

    // @NotBlank(message = "Địa chỉ cụ thể không được để trống")
    // @Size(min = 5, message = "Địa chỉ cụ thể phải có ít nhất 5 ký tự")
    // @Column(nullable = true)
    private String addressDetail;

    private boolean isDefault;
    // Constructor không có ID và danh sách users
    public Address(String name, String phone, String province, String district, String ward, String addressDetail,boolean isDefault) {
        this.name = name;
        this.phone = phone;
        this.province = province;
        this.district = district;
        this.ward = ward;
        this.addressDetail = addressDetail;
        this.isDefault = isDefault;
    }

    // Nếu không dùng liên kết với User, bạn có thể xóa hoặc giữ comment
    @ManyToMany(mappedBy = "addresses")
    private List<User> users = new ArrayList<>();
}