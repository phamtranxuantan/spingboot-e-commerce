import { Avatar, Box, Paper, Typography } from "@mui/material";

interface Message {
  sender: string;
  receiver: string;
  text: string;
  isAdmin: boolean;
}

interface SelectedUser {
  imageUser?: string;
  lastName?: string;
  firstName?: string;
}

const ChatMessage = ({
  messages,
  selectedUser,
}: {
  messages: Message[];
  selectedUser: SelectedUser | null;
}) => {
  return (
    <Box>
      {selectedUser && (
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={`http://localhost:8080/api/public/users/imageUser/${selectedUser.imageUser}`}
            alt="User Avatar"
          />
          <Typography variant="h6" ml={2}>
            {selectedUser.lastName} {selectedUser.firstName}
          </Typography>
        </Box>
      )}
      <Box style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages
          .map((message, index) => (
            <Box
              key={message.id || `${message.sender}-${message.receiver}-${message.timestamp}-${index}`}
              display="flex"
              justifyContent={message.isAdmin ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Paper
                elevation={3}
                style={{
                  padding: "10px 15px",
                  backgroundColor: message.isAdmin ? "#1976d2" : "#9e9e9e",
                  color: "white",
                  maxWidth: "75%",
                  wordWrap: "break-word",
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default ChatMessage;