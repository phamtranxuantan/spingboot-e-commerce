package com.phamtranxuantan.springboot.service;

import java.util.List;

import com.phamtranxuantan.springboot.payloads.OrderAddressDTO;
import com.phamtranxuantan.springboot.payloads.OrderDTO;
import com.phamtranxuantan.springboot.payloads.OrderResponse;

public interface OrderService {
  OrderDTO placeOrder(String emailid, Long cartId, String paymentMethod, OrderAddressDTO orderAddress);

  OrderDTO getOrder(String emailid, Long orderId);

  List<OrderDTO> getOrdersByUser(String emailId);

  OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

  OrderDTO updateOrder(String emailld, Long orderId, String orderStatus);
}