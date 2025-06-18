package com.phamtranxuantan.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.entity.ghn.District;
import com.phamtranxuantan.springboot.entity.ghn.Province;
import com.phamtranxuantan.springboot.entity.ghn.Ward;
import com.phamtranxuantan.springboot.service.GhnService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class GhnController {

    @Autowired
    private GhnService ghnService;

    @GetMapping("/public/ghn/provinces")
    public List<Province> getProvinces() {
        return ghnService.getProvinces();
    }

    @GetMapping("/public/ghn/districts")
    public List<District> getDistricts(@RequestParam int provinceId) {
        return ghnService.getDistricts(provinceId);
    }

    @GetMapping("/public/ghn/wards")
    public List<Ward> getWards(@RequestParam int districtId) {
        return ghnService.getWards(districtId);
    }
}
