package com.phamtranxuantan.springboot.payloads;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChatRequestDTO {
    private String message;
    @JsonProperty("is_logged_in")
    private boolean isLoggedIn; 
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    public boolean isLoggedIn() {
        return isLoggedIn;
    }

    public void setLoggedIn(boolean isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
    }
}
