package com.phamtranxuantan.springboot.entity.ghn;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class Province {
    @JsonProperty("ProvinceID")
    private int ProvinceID;
    @JsonProperty("ProvinceName")
    private String ProvinceName;
    @JsonProperty("CountryID")
    private int CountryID;
    @JsonProperty("Code")
    private String Code;
    @JsonProperty("NameExtension")
    private List<String> NameExtension;
    @JsonProperty("IsEnable")
    private int IsEnable;
    @JsonProperty("RegionID")
    private int RegionID;
    @JsonProperty("RegionCPN")
    private int RegionCPN;
    @JsonProperty("UpdatedBy")
    private int UpdatedBy;
    @JsonProperty("CreatedAt")
    private String CreatedAt;
    @JsonProperty("UpdatedAt")
    private String UpdatedAt;
    @JsonProperty("AreaID")
    private int AreaID;
    @JsonProperty("CanUpdateCOD")
    private boolean CanUpdateCOD;
    @JsonProperty("Status")
    private int Status;
    @JsonProperty("UpdatedEmployee")
    private int UpdatedEmployee;
    @JsonProperty("UpdatedSource")
    private String UpdatedSource;
    @JsonProperty("UpdatedDate")
    private String UpdatedDate;

}
