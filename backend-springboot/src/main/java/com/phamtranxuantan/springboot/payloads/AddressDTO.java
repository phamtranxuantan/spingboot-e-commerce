package com.phamtranxuantan.springboot.payloads;

import lombok.Data;

@Data
public class AddressDTO {
    private Long addressId;
    private String name;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String addressDetail;
    private boolean isDefault;
}