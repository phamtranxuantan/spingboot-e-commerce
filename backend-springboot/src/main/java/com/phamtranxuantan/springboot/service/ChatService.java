package com.phamtranxuantan.springboot.service;

import java.util.List;
import java.util.Optional;

import com.phamtranxuantan.springboot.entity.ChatMessage;
import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.payloads.AdminDTO;
import com.phamtranxuantan.springboot.payloads.UserDTO;

public interface ChatService {
    List<AdminDTO> getAdminUsers(); // Trả về AdminDTO

    void saveMessage(ChatMessage chatMessage);

    List<ChatMessage> getChatMessages(String sender, String receiver);

    List<ChatMessage> getAdminChatMessages(String sender, String receiver);

    List<ChatMessage> getAllMessagesForUser(String email);

    List<UserDTO> getUsersWhoMessagedAdmin(String adminEmail);

    Optional<User> getUserByEmail(String email);

    boolean isDuplicateMessage(ChatMessage chatMessage);
}
