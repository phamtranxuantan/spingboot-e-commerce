package com.phamtranxuantan.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.phamtranxuantan.springboot.entity.ChatMessage;

public interface ChatMessageRepo extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndReceiver(String sender, String receiver);

    List<ChatMessage> findBySenderOrReceiver(String sender, String receiver);

    List<ChatMessage> findByReceiver(String receiver);
}
