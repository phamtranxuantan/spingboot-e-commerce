import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connectWebSocket = (onPositionReceived) => {
    const socket = new SockJS('http://localhost:8080/ws'); // thay đổi nếu backend bạn khác
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log('[WS] Connected to server');

        // Lắng nghe topic định vị
        stompClient.subscribe('/topic/position', (message) => {
            const pos = JSON.parse(message.body);
            onPositionReceived(pos); // callback để cập nhật state
        });
    }, (err) => {
        console.error('[WS] Connection error', err);
    });
};

export const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log('[WS] Disconnected');
        });
    }
};
