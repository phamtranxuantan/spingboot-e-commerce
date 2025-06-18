package com.phamtranxuantan.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.phamtranxuantan.springboot.entity.OrderAddress;

@Repository
public interface OrderAddressRepo extends JpaRepository<OrderAddress, Long> {
}