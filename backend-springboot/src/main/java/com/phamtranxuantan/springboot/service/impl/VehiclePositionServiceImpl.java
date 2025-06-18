package com.phamtranxuantan.springboot.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.phamtranxuantan.springboot.controller.WebSocket.PositionWebSocketController;
import com.phamtranxuantan.springboot.entity.VehiclePosition;
import com.phamtranxuantan.springboot.repository.VehiclePositionRepo;
import com.phamtranxuantan.springboot.service.VehiclePositionService;



@Service
public class VehiclePositionServiceImpl implements VehiclePositionService {

    @Autowired
    private  VehiclePositionRepo vehiclePositionRepo;
    @Autowired
    private PositionWebSocketController webSocketVehiclePosition;
    @Override
    public VehiclePosition getPosition() {
        return vehiclePositionRepo.findById(1L).orElse(null);
    }
    private VehiclePosition lastKnownPosition = null;
    @Scheduled(fixedDelay = 1000) // Mỗi 1 giây kiểm tra DB
    public void checkForChanges() {
        VehiclePosition latest = vehiclePositionRepo.findTopByOrderByUpdatedAtDesc();

        if (latest != null && !latest.equals(lastKnownPosition)) {
            lastKnownPosition = latest;
            webSocketVehiclePosition.broadcastPosition(latest); 
        }
    }
    // @Override
    // public VehiclePosition updatePosition(double lat, double lng) {
    //     Optional<VehiclePosition> optional = vehiclePositionRepo.findById(1L);
    //     VehiclePosition position = optional.orElseGet(() -> new VehiclePosition(1L, lat, lng));
    //     position.setLatitude(lat);
    //     position.setLongitude(lng);
    //     return vehiclePositionRepo.save(position);
    // }
}
