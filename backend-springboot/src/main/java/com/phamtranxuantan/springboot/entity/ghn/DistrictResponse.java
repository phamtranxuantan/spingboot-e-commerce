package com.phamtranxuantan.springboot.entity.ghn;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DistrictResponse {
    @JsonProperty("data")
    private List<District> data;

    public List<District> getData() {
        return data;
    }

    public void setData(List<District> data) {
        this.data = data;
    }
}
