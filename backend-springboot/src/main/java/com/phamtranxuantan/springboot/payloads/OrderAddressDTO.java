package com.phamtranxuantan.springboot.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderAddressDTO {
    private Long orderAddressId;
    private String name;
    private String phone;
    private String addressDetail;
}
