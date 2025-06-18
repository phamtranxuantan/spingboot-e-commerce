package com.phamtranxuantan.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class GhnConfig {

    @Value("${SHIPPING_API_TOKEN}")
    private String apiToken;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getApiToken() {
        return apiToken;
    }
}
