package com.phamtranxuantan.springboot.controller;

import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phamtranxuantan.springboot.entity.ChatMessage;
import com.phamtranxuantan.springboot.payloads.AdminDTO;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.service.ChatService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private ConcurrentHashMap<String, String> userChatState = new ConcurrentHashMap<>();

    // Lưu trạng thái "đang chat với ai" của admin
    private ConcurrentHashMap<String, String> adminChatState = new ConcurrentHashMap<>();

    @GetMapping("/public/users/chat/admins")
    public List<AdminDTO> getAdminUsers() {
        return chatService.getAdminUsers();
    }

    @PostMapping("/public/users/chat/messages")
    public ResponseEntity<String> sendChatMessage(@RequestBody ChatMessage chatMessage) {
        chatMessage.setTimestamp(new Date());
        chatService.saveMessage(chatMessage);
        messagingTemplate.convertAndSend("/topic/message/admin/" + chatMessage.getReceiver(), chatMessage);
        return ResponseEntity.ok("Message sent successfully");
    }

    @GetMapping("/public/users/chat/messages")
    public List<ChatMessage> getChatMessages(@RequestParam String sender, @RequestParam String receiver) {
        List<ChatMessage> messages = chatService.getChatMessages(sender, receiver);
        messages.forEach(message -> {
            if (message.getReadTime() == null) {
                message.setReadTime(new Date());
                chatService.saveMessage(message);
            }
        });
        return messages;
    }

    @GetMapping("/public/admin/chat/messages")
    public List<ChatMessage> getUserAdminChatMessages(@RequestParam String sender, @RequestParam String receiver) {
        List<ChatMessage> messages = chatService.getAdminChatMessages(sender, receiver);
        messages.forEach(message -> {
            if (message.getReadTime() == null) {
                message.setReadTime(new Date());
                chatService.saveMessage(message);
            }
        });
        return messages;
    }

    @GetMapping("/admin/chat/messages")
    public List<ChatMessage> getAdminChatMessages(@RequestParam String sender, @RequestParam String receiver) {
        List<ChatMessage> messages = chatService.getAdminChatMessages(sender, receiver);
        messages.forEach(message -> {
            if (message.getReadTime() == null) {
                message.setReadTime(new Date());
                chatService.saveMessage(message);
            }
        });

        return messages;
    }

    @PostMapping("/public/users/chat/update-state")
    public ResponseEntity<String> updateUserChatState(@RequestParam String user, @RequestParam String admin) {
        userChatState.put(user, admin);
        return ResponseEntity.ok("User chat state updated");
    }

    @PostMapping("/admin/chat/update-state")
    public ResponseEntity<String> updateAdminChatState(@RequestParam String admin, @RequestParam String user) {
        adminChatState.put(admin, user);
        return ResponseEntity.ok("Admin chat state updated");
    }

    @GetMapping("/admin/chat/users")
    public List<UserDTO> getUsersWhoMessagedAdmin(@RequestParam String adminEmail) {
        return chatService.getUsersWhoMessagedAdmin(adminEmail);
    }

    @PostMapping("/admin/chat/messages")
    public ResponseEntity<String> sendAdminChatMessage(@RequestBody ChatMessage chatMessage) {
        chatMessage.setTimestamp(new Date());

        String currentReceiver = userChatState.get(chatMessage.getReceiver());
        if (currentReceiver != null && currentReceiver.equals(chatMessage.getSender())) {
            // Kiểm tra nếu tin nhắn đã được gửi trước đó
            if (chatService.isDuplicateMessage(chatMessage)) {
                System.out.println("Skipping duplicate message.");
                return ResponseEntity.ok("Duplicate message skipped");
            }

            var receiver = chatMessage.getReceiver();
            var userOptional = chatService.getUserByEmail(receiver);

            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Receiver not found");
            }

            var user = userOptional.get();
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(role -> role.getRoleName().equalsIgnoreCase("ADMIN"));

            if (isAdmin) {
                messagingTemplate.convertAndSend("/topic/message/admin/" + receiver, chatMessage);
            }
        } else {
            System.err.println("User is not currently chatting with this admin.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not currently chatting with this admin");
        }

        chatService.saveMessage(chatMessage);
        return ResponseEntity.ok("Message sent successfully");
    }

    @MessageMapping("/chat")
    public ResponseEntity<String> sendMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(new Date());
        var sender = chatMessage.getSender();
        var senderOptional = chatService.getUserByEmail(sender);
        boolean isFromAdmin = senderOptional.isPresent() && senderOptional.get().getRoles().stream()
                .anyMatch(role -> role.getRoleName().equalsIgnoreCase("ADMIN"));
        if (!isFromAdmin) {
            userChatState.put(chatMessage.getSender(), chatMessage.getReceiver());
        }
        var receiver = chatMessage.getReceiver();
        var userOptional = chatService.getUserByEmail(receiver);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Receiver not found");
        }
        var user = userOptional.get();
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getRoleName().equalsIgnoreCase("ADMIN"));
        if (isAdmin) {
            messagingTemplate.convertAndSend("/topic/message/admin/" + receiver, chatMessage);
        } else {
            String admin = userChatState.get(receiver);
            if (admin != null) {
                messagingTemplate.convertAndSend("/topic/message/user/" + receiver + "/admin/" + admin, chatMessage);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No admin assigned to this user");
            }
        }
        return ResponseEntity.ok("Message sent successfully");
    }
}
