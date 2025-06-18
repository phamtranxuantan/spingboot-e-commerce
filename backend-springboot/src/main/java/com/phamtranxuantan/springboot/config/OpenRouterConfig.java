package com.phamtranxuantan.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenRouterConfig {

    @Value("${openrouter.api.key.chat.bot}")
    private String apiKeyChatBot;

    @Value("${openrouter.api.key.imageProduct.url}")
    private String apiKeyAIimage;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    public String getApiKeyChatBot() {
        return apiKeyChatBot;
    }
    public String getApiKeyAIimage() {
        return apiKeyAIimage;
    }
    public String getApiUrl() {
        return apiUrl;
    }
}