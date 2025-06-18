package com.phamtranxuantan.springboot.service;

import java.util.Map;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.payloads.UserDTO;

public interface GoogleService {
    String createGoogleLoginUrl();

    String exchangeCodeForToken(String authorizationCode);

    Map<String, Object> getUserInfo(String accessToken);

    UserDTO processOAuthPostLogin(Map<String, Object> userInfo);

    String processOAuthPostLogin(OAuth2AuthenticationToken authentication);

    String generateToken(User user);
}
