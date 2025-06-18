import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { GET_ALL, POST_ADD } from "../../../api/apiService"; 
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import Siderbar from "./Siderbar";
const SupportProfile = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [currentSubscription, setCurrentSubscription] = useState(null); 
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        client.connect(
            {},
            () => {
                console.log("WebSocket connected");
                setStompClient(client);
                const currentUserEmail = localStorage.getItem("userEmail");
                if (currentUserEmail) {
                    client.subscribe(`/topic/message/user/${currentUserEmail}/admin/${selectedAdmin?.email}`, (response) => {
                        const data = JSON.parse(response.body);
                        setMessages((prev) => {
                            const isDuplicate = prev.some(
                                (msg) =>
                                    msg.timestamp === data.timestamp &&
                                    msg.sender === data.sender &&
                                    msg.receiver === data.receiver &&
                                    msg.text === data.text
                            );
                            return isDuplicate ? prev : [...prev, { ...data, isAdmin: true }];
                        });
                    });
                }
            },
            (error) => console.error("WebSocket connection error:", error)
        );
        return () => {
            if (client.connected) {
                client.disconnect(() => console.log("WebSocket disconnected"));
            }
        };
    }, [selectedAdmin]);
    useEffect(() => {
        if (stompClient && selectedAdmin) {
            if (currentSubscription) {
                currentSubscription.unsubscribe(); 
            }
            const subscription = stompClient.subscribe(`/topic/message/admin/${selectedAdmin.email}`, (response) => {
                const data = JSON.parse(response.body);
                const currentUserEmail = localStorage.getItem("userEmail");
                if (data.sender === selectedAdmin.email && data.receiver === currentUserEmail) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            ...data,
                            isAdmin: false, 
                        },
                    ]);
                }
            });
            setCurrentSubscription(subscription);
            const fetchMessages = async () => {
                const user = localStorage.getItem("userEmail"); 
                const admin = selectedAdmin.email; 
                try {
                    const userResponse = await GET_ALL(`users/chat/messages?sender=${encodeURIComponent(user)}&receiver=${encodeURIComponent(admin)}`);
                    const userMessages = userResponse.map((msg) => ({
                        ...msg,
                        isAdmin: false, 
                    }));
                    const adminResponse = await GET_ALL(`admin/chat/messages?sender=${encodeURIComponent(admin)}&receiver=${encodeURIComponent(user)}`);
                    const adminMessages = adminResponse.map((msg) => ({
                        ...msg,
                        isAdmin: true, 
                    }));
                    const combinedMessages = [...userMessages, ...adminMessages].sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );
                    const uniqueMessages = combinedMessages.filter(
                        (msg, index, self) =>
                            index === self.findIndex((m) => m.timestamp === msg.timestamp && m.sender === msg.sender && m.text === msg.text)
                    );
                    setMessages(uniqueMessages);
                } catch (error) {
                    console.error("Lỗi khi lấy tin nhắn:", error);
                }
            };
            fetchMessages();
        }
    }, [stompClient, selectedAdmin]); 
    const handleSendMessage = async (message) => {
        if (!stompClient || !stompClient.connected || !selectedAdmin) return;
        const sender = localStorage.getItem("userEmail");
        const receiver = selectedAdmin.email;
        const newMessage = { sender, receiver, text: message, timestamp: new Date().toISOString() };
        setMessages((prev) => [...prev, { ...newMessage, isAdmin: false }]);
        try {
            await POST_ADD("users/chat/messages", newMessage);
            stompClient.send("/app/chat", {}, JSON.stringify(newMessage));
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    return (
        <div className="d-flex h-100">
            <div className="col-3 bg-light border-end vh-100 overflow-auto">
                <Siderbar setSelectedAdmin={setSelectedAdmin}></Siderbar>
            </div>
            <div className="col-9 d-flex flex-column">
                {selectedAdmin ? (
                    <>
                        <div className="flex-grow-1 overflow-auto p-3">
                            <ChatMessage
                                messages={messages}
                                selectedAdmin={selectedAdmin}
                            />
                            {messages.length === 0 && (
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                    <h1 className="display-6 text-secondary font-weight-bold">
                                        Chưa có tin nhắn
                                    </h1>
                                </div>
                            )}
                        </div>
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            selectedAdmin={selectedAdmin}
                        ></ChatInput>
                    </>
                ) : (
                    <div className="h-100 d-flex justify-content-center align-items-center">
                        <h1 className="display-6 text-secondary font-weight-bold">
                            Chọn một admin để được hỗ trợ!!!
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};
export default SupportProfile;