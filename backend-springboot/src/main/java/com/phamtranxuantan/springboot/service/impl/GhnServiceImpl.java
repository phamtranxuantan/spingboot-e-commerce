package com.phamtranxuantan.springboot.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.phamtranxuantan.springboot.config.GhnConfig;
import com.phamtranxuantan.springboot.entity.ghn.District;
import com.phamtranxuantan.springboot.entity.ghn.DistrictResponse;
import com.phamtranxuantan.springboot.entity.ghn.Province;
import com.phamtranxuantan.springboot.entity.ghn.ProvinceResponse;
import com.phamtranxuantan.springboot.entity.ghn.Ward;
import com.phamtranxuantan.springboot.entity.ghn.WardResponse;
import com.phamtranxuantan.springboot.service.GhnService;

@Service
public class GhnServiceImpl implements GhnService {

    private static final Logger logger = LoggerFactory.getLogger(GhnServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private GhnConfig ghnConfig;

    @Override
    public List<Province> getProvinces() {
        String url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", ghnConfig.getApiToken());
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<ProvinceResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity,
                ProvinceResponse.class);

        List<Province> provinces = response.getBody().getData();
        if (provinces == null || provinces.isEmpty()) {
            logger.error("No data received from GHN API for provinces");
            throw new RuntimeException("No data received from GHN API");
        }

        logger.info("Received provinces data: {}", provinces);
        return provinces;
    }

    @Override
    public List<District> getDistricts(int provinceId) {
        String url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id="
                + provinceId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", ghnConfig.getApiToken());
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<DistrictResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity,
                DistrictResponse.class);

        List<District> districts = response.getBody().getData();
        if (districts == null || districts.isEmpty()) {
            logger.error("No data received from GHN API for districts");
            throw new RuntimeException("No data received from GHN API");
        }

        logger.info("Received districts data: {}", districts);
        return districts;
    }

    @Override
    public List<Ward> getWards(int districtId) {
        String url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + districtId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("token", ghnConfig.getApiToken());
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<WardResponse> response = restTemplate.exchange(url, HttpMethod.GET, entity, WardResponse.class);

        List<Ward> wards = response.getBody().getData();
        if (wards == null || wards.isEmpty()) {
            logger.error("No data received from GHN API for wards");
            throw new RuntimeException("No data received from GHN API");
        }

        logger.info("Received wards data: {}", wards);
        return wards;
    }
}
