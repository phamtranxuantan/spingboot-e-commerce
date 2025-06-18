/* eslint-disable react/prop-types */
// src/ChatInput.js

import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

interface ChatInputProps {
  selectedUser: { email: string } | null;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ selectedUser, onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (text.trim() && selectedUser) {
      onSendMessage(text);
      setText(""); 
    } else {
      console.warn("Message text is empty or user is not selected");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSend}
      display="flex"
      alignItems="center"
      p={2}
      borderTop="1px solid #ddd"
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!text.trim() || !selectedUser || !selectedUser.email}
      >
        Gửi
      </Button>
    </Box>
  );
};

export default ChatInput;
