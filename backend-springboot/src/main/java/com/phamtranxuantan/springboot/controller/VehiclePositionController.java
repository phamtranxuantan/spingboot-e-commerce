package com.phamtranxuantan.springboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.phamtranxuantan.springboot.entity.VehiclePosition;
import com.phamtranxuantan.springboot.service.VehiclePositionService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class VehiclePositionController {
    @Autowired
    private VehiclePositionService vehiclePositionServiceservice;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/public/users/vehicle-position")
    public VehiclePosition getVehiclePosition() {
        return vehiclePositionServiceservice.getPosition();
    }

    // @PutMapping("/public/users/vehicle-position")
    // public VehiclePosition updateVehiclePosition(@RequestBody VehiclePosition pos) {
    //     return vehiclePositionServiceservice.updatePosition(pos.getLatitude(), pos.getLongitude());
    // }


}