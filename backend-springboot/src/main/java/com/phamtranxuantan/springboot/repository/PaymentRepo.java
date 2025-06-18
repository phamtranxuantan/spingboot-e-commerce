package com.phamtranxuantan.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.phamtranxuantan.springboot.entity.Payment;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
}