package com.phamtranxuantan.springboot.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
  private Long cartItemId;
  private double discount;
  private double productPrice;
  private CartDTO cart;
  private ProductDTO product;
  private Integer quantity;
  
  
}