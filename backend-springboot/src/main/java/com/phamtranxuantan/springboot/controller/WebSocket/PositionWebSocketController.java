package com.phamtranxuantan.springboot.controller.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.phamtranxuantan.springboot.entity.VehiclePosition;
@Controller
public class PositionWebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastPosition(VehiclePosition position) {
        messagingTemplate.convertAndSend("/topic/position", position);
    }
}
