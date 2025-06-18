package com.phamtranxuantan.springboot.service;

import java.util.List;

import com.phamtranxuantan.springboot.payloads.CartDTO;

public interface CartService {
  CartDTO addProductToCart(Long cartId, Long productId, Integer quantity);

  List<CartDTO> getAllCarts();

  CartDTO getCart(String emailid, Long cartId);

  CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity);

  void updateProductInCarts(Long cartId, Long productId);

  String deleteProductFromCart(Long cartId, Long productId);
}