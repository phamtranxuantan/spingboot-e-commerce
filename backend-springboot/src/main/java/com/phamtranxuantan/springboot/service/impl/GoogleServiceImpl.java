package com.phamtranxuantan.springboot.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.phamtranxuantan.springboot.entity.Address;
import com.phamtranxuantan.springboot.entity.Cart;
import com.phamtranxuantan.springboot.entity.Role;
import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.exceptions.ResourceNotFoundException;
import com.phamtranxuantan.springboot.payloads.AddressDTO;
import com.phamtranxuantan.springboot.payloads.CartDTO;
import com.phamtranxuantan.springboot.payloads.ProductDTO;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.repository.AddressRepo;
import com.phamtranxuantan.springboot.repository.CartRepo;
import com.phamtranxuantan.springboot.repository.RoleRepo;
import com.phamtranxuantan.springboot.repository.UserRepo;
import com.phamtranxuantan.springboot.service.GoogleService;
import com.phamtranxuantan.springboot.sucurity.JWTUtil;

@Service
public class GoogleServiceImpl implements GoogleService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.registration.google.scope}")
    private String scope;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public String createGoogleLoginUrl() {
        String authorizationEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
        String normalizedScope = scope.replace(",", " ");
        String encodedScope = URLEncoder.encode(normalizedScope, StandardCharsets.UTF_8);

        return UriComponentsBuilder.fromUriString(authorizationEndpoint)
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", encodedScope)
                .queryParam("access_type", "offline")
                .build()
                .toUriString();
    }

    @Override
    public String exchangeCodeForToken(String authorizationCode) {
        String tokenEndpoint = "https://oauth2.googleapis.com/token";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("client_id", clientId);
        requestBody.put("client_secret", clientSecret);
        requestBody.put("code", authorizationCode);
        requestBody.put("grant_type", "authorization_code");
        requestBody.put("redirect_uri", redirectUri);

        Map<String, String> response = restTemplate.postForObject(tokenEndpoint, requestBody, Map.class);
        return response.get("access_token");
    }

    @Override
    public Map<String, Object> getUserInfo(String accessToken) {
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
        RestTemplate restTemplate = new RestTemplate();

        String uri = UriComponentsBuilder.fromUriString(userInfoEndpoint)
                .queryParam("access_token", accessToken)
                .build().toUriString();

        return restTemplate.getForObject(uri, Map.class);
    }

    @Override
    public UserDTO processOAuthPostLogin(Map<String, Object> userInfo) {
        String email = (String) userInfo.get("email");

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFirstName("chuacapnhat");
            user.setLastName("chuacapnhat");

            user = userRepo.save(user);

            Role role = roleRepo.findById(102L)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "id", 102L));
            user.getRoles().add(role);
            user = userRepo.save(user);
            String name = "chuacapnhat";
            String phone = "chuacapnhat";
            String province = "chuacapnhat";
            String district = "chuacapnhat";
            String ward = "chuacapnhat";
            String addressDetail = "chuacapnhat";
            boolean isDefault = false;
            Address address = addressRepo.findByProvinceDistrictWardAddressDetail(name,phone,
                province, district, ward, addressDetail,isDefault);

            if (address == null) {
                address = new Address(name,phone,province, district, ward, addressDetail,isDefault);
                address = addressRepo.save(address);
            }

            if (!user.getAddresses().contains(address)) {
                user.getAddresses().add(address);
                user = userRepo.save(user);
            }

            Cart cart = new Cart();
            cart.setUser(user);
            cart = cartRepo.save(cart);

            user.setCart(cart);
            userRepo.save(user);
        }

        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            userDTO.setAddress(modelMapper.map(user.getAddresses().get(0), AddressDTO.class));
        }

        if (user.getCart() != null) {
            CartDTO cartDTO = modelMapper.map(user.getCart(), CartDTO.class);
            List<ProductDTO> products = user.getCart().getCartItems().stream()
                    .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class)).collect(Collectors.toList());
            cartDTO.setProducts(products);
            userDTO.setCart(cartDTO);
        }

        return userDTO;
    }

    @Override
    public String processOAuthPostLogin(OAuth2AuthenticationToken authentication) {
        String email = authentication.getPrincipal().getAttribute("email");
        return email;
    }

    @Override
    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail());
    }
}
