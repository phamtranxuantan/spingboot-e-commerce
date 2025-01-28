package com.phamtranxuantan.example05.payloads;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
  private Long cartId;
  private Double totalPrice = 0.0;
  //thêm thuộc tính userEmail test
  private String userEmail;

  //chỉnh sua thuoc tinh cartItems để lấy dữ liệu từ CartItemDTO chứ không phải từ ProductDTO(có nghĩa là quantity của cartItem chứ không phải quantity của prouct)
  //private List<CartItemDTO> cartItems = new ArrayList<>();
  private List<ProductDTO> products = new ArrayList<>();
}