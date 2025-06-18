package com.phamtranxuantan.springboot.entity.ghn;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class District {
    @JsonProperty("DistrictID")
    private int DistrictID;
    @JsonProperty("ProvinceID")
    private int ProvinceID;
    @JsonProperty("DistrictName")
    private String DistrictName;
    @JsonProperty("Code")
    private String Code;
    @JsonProperty("Type")
    private int Type;
    @JsonProperty("SupportType")
    private int SupportType;
    @JsonProperty("NameExtension")
    private List<String> NameExtension;
    @JsonProperty("IsEnable")
    private int IsEnable;
    @JsonProperty("UpdatedBy")
    private int UpdatedBy;
    @JsonProperty("CreatedAt")
    private String CreatedAt;
    @JsonProperty("UpdatedAt")
    private String UpdatedAt;
    @JsonProperty("CanUpdateCOD")
    private boolean CanUpdateCOD;
    @JsonProperty("Status")
    private int Status;
    @JsonProperty("PickType")
    private int PickType;
    @JsonProperty("DeliverType")
    private int DeliverType;
    @JsonProperty("WhiteListClient")
    private WhiteListClient WhiteListClient;
    @JsonProperty("WhiteListDistrict")
    private WhiteListDistrict WhiteListDistrict;
    @JsonProperty("ReasonCode")
    private String ReasonCode;
    @JsonProperty("ReasonMessage")
    private String ReasonMessage;
    @JsonProperty("OnDates")
    private Object OnDates;
    @JsonProperty("UpdatedEmployee")
    private int UpdatedEmployee;
    @JsonProperty("UpdatedSource")
    private String UpdatedSource;
    @JsonProperty("UpdatedDate")
    private String UpdatedDate;

    @Getter
    @Setter
    public static class WhiteListClient {
        @JsonProperty("From")
        private List<Object> From;
        @JsonProperty("To")
        private List<Object> To;
        @JsonProperty("Return")
        private List<Object> Return;
    }

    @Getter
    @Setter
    public static class WhiteListDistrict {
        @JsonProperty("From")
        private Object From;
        @JsonProperty("To")
        private Object To;
    }
}
