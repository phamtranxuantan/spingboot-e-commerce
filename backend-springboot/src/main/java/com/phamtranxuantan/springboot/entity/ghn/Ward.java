package com.phamtranxuantan.springboot.entity.ghn;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Ward {
    @JsonProperty("WardCode")
    private String WardCode;
    @JsonProperty("DistrictID")
    private int DistrictID;
    @JsonProperty("WardName")
    private String WardName;
    @JsonProperty("NameExtension")
    private List<String> NameExtension;
    @JsonProperty("IsEnable")
    private int IsEnable;
    @JsonProperty("CanUpdateCOD")
    private boolean CanUpdateCOD;
    @JsonProperty("UpdatedBy")
    private int UpdatedBy;
    @JsonProperty("CreatedAt")
    private String CreatedAt;
    @JsonProperty("UpdatedAt")
    private String UpdatedAt;
    @JsonProperty("SupportType")
    private int SupportType;
    @JsonProperty("PickType")
    private int PickType;
    @JsonProperty("DeliverType")
    private int DeliverType;
    @JsonProperty("WhiteListClient")
    private WhiteListClient WhiteListClient;
    @JsonProperty("WhiteListWard")
    private WhiteListWard WhiteListWard;
    @JsonProperty("Status")
    private int Status;
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
    public static class WhiteListWard {
        @JsonProperty("From")
        private Object From;
        @JsonProperty("To")
        private Object To;
    }
}
