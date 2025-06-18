package com.phamtranxuantan.springboot.service;

import java.util.List;

import com.phamtranxuantan.springboot.entity.ghn.District;
import com.phamtranxuantan.springboot.entity.ghn.Province;
import com.phamtranxuantan.springboot.entity.ghn.Ward;

public interface GhnService {
    List<Province> getProvinces();

    List<District> getDistricts(int provinceId);

    List<Ward> getWards(int districtId);
}
