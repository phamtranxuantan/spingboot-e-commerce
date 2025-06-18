import React, { useState, useRef, useEffect } from "react";
import { FaMinus } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import ReactMarkdown from "react-markdown"; // 👈 Xử lý markdown
import styles from "./ChatBot.module.css";
import { POST_ADD } from "../../api/apiService";

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]); // 👈 Lưu danh sách tin nhắn
  const messagesEndRef = useRef(null); // 👈 Tham chiếu đến cuối vùng chat
  const userEmail = localStorage.getItem("userEmail");
  const isLoggedIn = !!userEmail;
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Thêm tin nhắn người dùng
    const userMessage = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await POST_ADD("ask", {
        message: inputValue,
        is_logged_in: isLoggedIn,
      });

      const aiMessage = {
        content: response.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
        },
      ]);
    }
  };
  const renderMessageContent = (content) => {
    const imageRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif)|[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|gif))/g;
  
    const parts = content.split(imageRegex);
  
    return parts.map((part, index) => {
      if (imageRegex.test(part.trim())) {
        const imageUrl = part.startsWith("http")
          ? part
          : `${part.trim()}`; // 👈 Đường dẫn ảnh
        return (
          <div key={index} style={{ margin: "10px 0" }}>
            <img
              src={imageUrl}
              alt="Sản phẩm"
              style={{ maxWidth: "50%",maxHeight: "70%", borderRadius: "8px" }}
            />
          </div>
        );
      } else {
        return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
      }
    });
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // 👇 Tự động scroll xuống cuối mỗi khi tin nhắn thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.chatbot}>
      <div className={styles.messengerIcon} onClick={toggleChat}>
        <img src="/assets/img/chatbot/chatbot.png" alt="Chatbot" />
      </div>
      <div className={`${styles.chatBox} ${isChatOpen ? styles.open : ""}`}>
        <div className={styles.chatHeader}>
          <h className={styles.headerText}>
            <RiRobot3Fill />
          </h>
          <span className={styles.headTitle}>Alistyle AI Shop</span>
          <button onClick={toggleChat}>
            <FaMinus />
          </button>
        </div>

        <div className={styles.chatMessages}>
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }
              >
                 {renderMessageContent(msg.content)}
              </div>
            ))}
          {/* 👇 Thẻ cuối cùng để auto scroll */}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatFooter}>
          <input
            type="text"
            placeholder="Nhập tin nhắn"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className={styles.sendMessageButton}
            onClick={handleSendMessage}
          >
            <img src="/assets/img/chatbot/send-message.png" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
