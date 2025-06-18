package com.phamtranxuantan.springboot.repository;

import com.phamtranxuantan.springboot.entity.VehiclePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehiclePositionRepo extends JpaRepository<VehiclePosition, Long> {
    VehiclePosition findTopByOrderByUpdatedAtDesc();
}