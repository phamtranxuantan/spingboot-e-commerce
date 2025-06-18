package com.phamtranxuantan.springboot.entity.ghn;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WardResponse {
    @JsonProperty("data")
    private List<Ward> data;

    public List<Ward> getData() {
        return data;
    }

    public void setData(List<Ward> data) {
        this.data = data;
    }
}
