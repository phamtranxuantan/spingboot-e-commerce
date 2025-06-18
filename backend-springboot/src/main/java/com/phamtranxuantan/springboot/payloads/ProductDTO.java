package com.phamtranxuantan.springboot.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
  private Long productId;
  private Long categoryId;
  private String productName;
  private String imageProduct;
  private String description;
  private String categoryName;
  private Integer quantity;
  private Integer weight;
  private double price;
  private double discount;
  private double specialPrice;
}
