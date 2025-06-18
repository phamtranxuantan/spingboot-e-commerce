import { Card, CardContent, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { dataProvider } from "../../dataProvider";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import Siderbar from "./Siderbar";

const SupportProfile = () => {
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [selectedUser, setselectedUser] = useState(null);
  const subscriptions = useRef({ adminSub: null, userSub: null });
  const adminEmail = localStorage.getItem("adminEmail");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        console.log("WebSocket connected");
        setStompClient(client);

        if (adminEmail) {
          // Lắng nghe topic dành cho admin
          subscriptions.current.adminSub = client.subscribe(
            `/topic/message/admin/${adminEmail}`,
            (response) => {
              const data = JSON.parse(response.body);
              setMessages((prev) => {
                const isDuplicate = prev.some((msg) => msg.id === data.id);
                return isDuplicate ? prev : [...prev, { ...data, isAdmin: false }];
              });
            }
          );
        }
      },
      (error) => console.error("WebSocket connection error:", error)
    );

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);

  useEffect(() => {
    if (stompClient && selectedUser) {
      if (subscriptions.current.userSub) {
        subscriptions.current.userSub.unsubscribe();
        subscriptions.current.userSub = null;
      }

      const topic = `/topic/message/user/${selectedUser.email}/admin/${adminEmail}`;
      subscriptions.current.userSub = stompClient.subscribe(topic, (response) => {
        const data = JSON.parse(response.body);
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) =>
              msg.id === data.id || // Kiểm tra ID
              (msg.timestamp === data.timestamp &&
                msg.sender === data.sender &&
                msg.receiver === data.receiver &&
                msg.text === data.text) // Kiểm tra nội dung
          );
          return isDuplicate ? prev : [...prev, { ...data, isAdmin: true }];
        });
      });
    }

    return () => {
      if (subscriptions.current.userSub) {
        subscriptions.current.userSub.unsubscribe();
        subscriptions.current.userSub = null;
      }
    };
  }, [stompClient, selectedUser]);

  const updateAdminChatState = async (userEmail: string) => {
    try {
      const adminEmail = localStorage.getItem("adminEmail");
      if (!adminEmail || !userEmail) return;

      // Gọi API để cập nhật trạng thái admin
      await dataProvider.create("adminChatState", {
        data: { admin: adminEmail, user: userEmail },
      });
      console.log("Admin chat state updated successfully");
    } catch (error) {
      console.error("Failed to update admin chat state:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      // Cập nhật trạng thái admin khi chọn user mới
      updateAdminChatState(selectedUser.email);

      const fetchMessages = async () => {
        try {
          const admin = localStorage.getItem("adminEmail");
          const user = selectedUser.email;

          const [adminResponse, userResponse] = await Promise.all([
            dataProvider.getList("adminChatMessages", { filter: { admin, user } }),
            dataProvider.getList("userChatMessages", { filter: { sender: user, receiver: admin } }),
          ]);

          // Gắn `isAdmin` cho từng tin nhắn
          const adminMessages = adminResponse.data.map((msg) => ({
            ...msg,
            isAdmin: true, // Tin nhắn từ admin
          }));

          const userMessages = userResponse.data.map((msg) => ({
            ...msg,
            isAdmin: false, // Tin nhắn từ user
          }));

          // Kết hợp và sắp xếp tin nhắn theo timestamp
          const messages = [...adminMessages, ...userMessages].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          setMessages(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!selectedUser || !stompClient || !stompClient.connected) return;

    const sender = adminEmail;
    const receiver = selectedUser.email;

    const newMessage = { sender, receiver, text: message, timestamp: new Date().toISOString() };

    setMessages((prev) => [...prev, { ...newMessage, isAdmin: true }]);

    try {
      await dataProvider.create("adminChatMessages", { data: newMessage });
      stompClient.send("/app/chat", {}, JSON.stringify(newMessage));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Grid container spacing={2} style={{ height: "100%" }}>
      <Grid item xs={3}>
        <Card style={{ height: "100%" }}>
          <CardContent>
            <Siderbar setselectedUser={setselectedUser} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={9}>
        <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardContent style={{ flexGrow: 1, overflow: "auto" }}>
            {selectedUser ? (
              <ChatMessage messages={messages} selectedUser={selectedUser} />
            ) : (
              <div className="h-100 d-flex justify-content-center align-items-center">
                <h1 className="display-6 text-secondary font-weight-bold">
                  Không có yêu cầu hỗ trợ!!!
                </h1>
              </div>
            )}
          </CardContent>
          {selectedUser && <ChatInput selectedUser={selectedUser} onSendMessage={handleSendMessage} />}
        </Card>
      </Grid>
    </Grid>
  );
};

export default SupportProfile;
