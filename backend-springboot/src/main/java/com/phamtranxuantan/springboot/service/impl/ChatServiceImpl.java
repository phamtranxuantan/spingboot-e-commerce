package com.phamtranxuantan.springboot.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.phamtranxuantan.springboot.entity.ChatMessage;
import com.phamtranxuantan.springboot.entity.User;
import com.phamtranxuantan.springboot.payloads.AdminDTO;
import com.phamtranxuantan.springboot.payloads.UserDTO;
import com.phamtranxuantan.springboot.repository.ChatMessageRepo;
import com.phamtranxuantan.springboot.repository.UserRepo;
import com.phamtranxuantan.springboot.service.ChatService;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ChatMessageRepo chatMessageRepo;

    @Override
    public List<AdminDTO> getAdminUsers() {
        return userRepo.findAll().stream()
                .filter(user -> user.getRoles().stream().anyMatch(role -> role.getRoleName().equals("ADMIN")))
                .map(user -> new AdminDTO(user.getUserId(), user.getFirstName(), user.getLastName(),
                        user.getMobileNumber(), user.getImageUser(), user.getEmail(), user.getRoles()))
                .collect(Collectors.toList());
    }

    @Override
    public void saveMessage(ChatMessage chatMessage) {
        chatMessageRepo.save(chatMessage);
    }

    @Override
    public List<ChatMessage> getChatMessages(String sender, String receiver) {
        // Lấy cả tin nhắn từ sender đến receiver và từ receiver đến sender
        return chatMessageRepo.findBySenderAndReceiver(sender, receiver)
                .stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatMessage> getAdminChatMessages(String sender, String receiver) {
        return chatMessageRepo.findBySenderAndReceiver(sender, receiver);
    }

    @Override
    public List<ChatMessage> getAllMessagesForUser(String email) {

        return chatMessageRepo.findBySenderOrReceiver(email, email);
    }

    @Override
    public List<UserDTO> getUsersWhoMessagedAdmin(String adminEmail) {
        return chatMessageRepo.findByReceiver(adminEmail).stream()
                .map(ChatMessage::getSender)
                .distinct()
                .map(senderEmail -> userRepo.findByEmail(senderEmail)) // Tìm user theo email
                .filter(Optional::isPresent) // Bỏ qua các user không tồn tại
                .map(optionalUser -> optionalUser.get()) // Lấy user từ Optional
                .map(user -> new UserDTO(
                        user.getUserId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getMobileNumber(),
                        user.getImageUser(),
                        user.getEmail(),
                        null,
                        null,
                        null, null))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public boolean isDuplicateMessage(ChatMessage chatMessage) {
        // Kiểm tra tin nhắn gần nhất giữa sender và receiver
        List<ChatMessage> recentMessages = chatMessageRepo.findBySenderAndReceiver(
                chatMessage.getSender(), chatMessage.getReceiver());
        if (!recentMessages.isEmpty()) {
            ChatMessage lastMessage = recentMessages.get(recentMessages.size() - 1);
            return lastMessage.getText().equals(chatMessage.getText()) &&
                    lastMessage.getTimestamp().equals(chatMessage.getTimestamp());
        }
        return false;
    }

}
