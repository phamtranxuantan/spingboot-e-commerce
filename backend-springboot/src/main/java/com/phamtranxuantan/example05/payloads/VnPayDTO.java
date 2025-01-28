package com.phamtranxuantan.example05.payloads;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VnPayDTO implements Serializable{
    private String status;
    private String message;
    private String URL;
    
}
