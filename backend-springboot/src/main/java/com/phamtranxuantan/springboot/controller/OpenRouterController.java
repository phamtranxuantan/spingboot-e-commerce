package com.phamtranxuantan.springboot.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.phamtranxuantan.springboot.payloads.ChatRequestDTO;
import com.phamtranxuantan.springboot.payloads.ChatResponseDTO;
import com.phamtranxuantan.springboot.payloads.ImageRequestDTO;
import com.phamtranxuantan.springboot.service.OpenRouterService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class OpenRouterController {

    @Autowired
    private OpenRouterService openRouterService;

    @PostMapping("/public/ask")
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        String message = request.getMessage();
        boolean isLoggedIn = request.isLoggedIn();
        String reply;
        if (isLoggedIn == true) {
            reply = openRouterService.generateSmartReply(message);
        } else {
            reply = openRouterService.generateGeneralReply(message);
        }
        return ResponseEntity.ok(new ChatResponseDTO(reply));
    }

    @PostMapping("/admin/analyze-image")
    public ResponseEntity<Map<String, String>> analyzeImage(@RequestBody ImageRequestDTO request) {
        String imageUrl = request.getImageUrl();
        String aiDescription = openRouterService.getImageDescription(imageUrl);
        Map<String, String> response = new HashMap<>();
        response.put("description", aiDescription);
        return ResponseEntity.ok(response);
    }
}