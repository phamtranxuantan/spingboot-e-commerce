/* eslint-disable react/prop-types */
// src/ChatInput.js

import React, { useEffect, useState } from "react";

const ChatInput = ({ selectedAdmin, onSendMessage }) => {
  const [text, setText] = useState("");

  useEffect(() => {
  }, [selectedAdmin]);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim() && selectedAdmin) {
      onSendMessage(text); // Gọi hàm gửi tin nhắn từ props
      setText(""); // Xóa nội dung input sau khi gửi
    } else {
      console.warn("Không thể gửi tin nhắn: Nội dung rỗng hoặc chưa chọn admin.");
    }
  };

  return (
    <footer className="bg-white border-top w-100 p-3">
      <form onSubmit={handleSend}>
        <div className="d-flex align-items-center w-100">
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Nhập tin nhắn..."
            className="form-control me-2"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!text.trim() || !selectedAdmin || !selectedAdmin.email} // Ensure selectedAdmin and email exist
          >
            Gửi
          </button>
        </div>
      </form>
    </footer>
  );
};

export default ChatInput;
