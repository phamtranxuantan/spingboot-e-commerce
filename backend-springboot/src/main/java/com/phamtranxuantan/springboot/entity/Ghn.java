package com.phamtranxuantan.springboot.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.phamtranxuantan.springboot.entity.ghn.District;
import com.phamtranxuantan.springboot.entity.ghn.Province;

public class Ghn {

    @JsonProperty("data")
    private List<Province> dataProvince;

    public List<Province> getDataProvince() {
        return dataProvince;
    }

    public void setDataProvince(List<Province> dataProvince) {
        this.dataProvince = dataProvince;
    }

    @JsonProperty("data")
    private List<District> dataDistrict;

    public List<District> getDataDistrict() {
        return dataDistrict;
    }

    public void setDataDistrict(List<District> dataDistrict) {
        this.dataDistrict = dataDistrict;
    }
}
