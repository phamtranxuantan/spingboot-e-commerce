package com.phamtranxuantan.springboot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.payloads.CartDTO;
import com.phamtranxuantan.springboot.service.CartService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class CartController {

  @Autowired
  private CartService cartService;

  @PostMapping("/public/carts/{cartId}/products/{productId}/quantity/{quantity}")
  public ResponseEntity<CartDTO> addProductToCart(@PathVariable Long cartId, @PathVariable Long productId,
      @PathVariable Integer quantity) {
    CartDTO cartDTO = cartService.addProductToCart(cartId, productId, quantity);

    return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.CREATED);
  }

  @GetMapping("/admin/carts")
  public ResponseEntity<Map<String, List<CartDTO>>> getCarts() {
    List<CartDTO> cartDTOs = cartService.getAllCarts();

    Map<String, List<CartDTO>> response = new HashMap<>();
    response.put("content", cartDTOs);

    return new ResponseEntity<>(response, HttpStatus.OK);
  }
  @GetMapping("/public/users/{emailId}/carts/{cartId}")
  public ResponseEntity<CartDTO> getCartById(@PathVariable String emailId, @PathVariable Long cartId) {
    // In ra giá trị của emailId và cartId để kiểm tra
    System.out.println("Email ID: " + emailId);
    System.out.println("Cart ID: " + cartId);

    CartDTO cartDTO = cartService.getCart(emailId, cartId);

    // Kiểm tra giá trị của cartDTO
    System.out.println("CartDTO: " + cartDTO);

    return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
  }
  // @GetMapping("/public/users/{emailId}/carts/{cartId}")
  // public ResponseEntity<CartDTO> getCartById(@PathVariable String emailId, @PathVariable Long cartId) {
  //   CartDTO cartDTO = cartService.getCart(emailId, cartId);

  //   return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
  // }

  @PutMapping("/public/carts/{cartId}/products/{productId}/quantity/{quantity}")
  public ResponseEntity<CartDTO> updateCartProduct(@PathVariable Long cartId, @PathVariable Long productId,
      @PathVariable Integer quantity) {
    CartDTO cartDTO = cartService.updateProductQuantityInCart(cartId, productId, quantity);

    return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
  }

  @DeleteMapping("/public/carts/{cartId}/product/{productId}")
  public ResponseEntity<String> deleteProductFromCart(@PathVariable Long cartId, @PathVariable Long productId) {
    String status = cartService.deleteProductFromCart(cartId, productId);

    return new ResponseEntity<String>(status, HttpStatus.OK);
  }
}
