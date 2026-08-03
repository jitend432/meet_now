import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { store } from '../redux/store'; // Redux store directly import kiya

let client = null;
let isConnected = false;
let onStatusChangeCallback = null;

export const socketService = {
  connect: (onStatusChange, onMessageReceived) => {
    if (client && isConnected) {
      console.log("⚠️ SocketService: Already Connected!");
      return;
    }

    // Directly extracting token from redux state exactly like apiService interceptor
    const state = store.getState();
    const token = state.auth?.token; 

    if (!token || token === 'null' || token.trim() === '') {
      console.error("❌ SocketService: Token not found in Redux Auth Slice State!");
      if (onStatusChange) onStatusChange("Error");
      return;
    }

    const serverUrl = "https://vynkdating.com/ws";
    if (onStatusChange) onStatusChangeCallback = onStatusChange;

    onStatusChangeCallback?.("Connecting...");

    client = new Client({
      webSocketFactory: () => new SockJS(serverUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      maxRetryDelay: 60000,
    });

    client.onConnect = (frame) => {
      isConnected = true;
      onStatusChangeCallback?.("Connected");

      client.subscribe('/user/queue/messages', (messagePayload) => {
        if (messagePayload.body) {
          try {
            const incomingData = JSON.parse(messagePayload.body);
            if (onMessageReceived) onMessageReceived(incomingData);
          } catch (e) {
            console.error("Error parsing inbound live socket frame:", e);
          }
        }
      });
    };

    client.onStompError = (frame) => {
      isConnected = false;
      onStatusChangeCallback?.("Error");
      console.error("STOMP protocol error:", frame.headers['message']);
    };

    client.onWebSocketError = () => {
      isConnected = false;
      onStatusChangeCallback?.("Disconnected");
    };

    client.onWebSocketClose = () => {
      isConnected = false;
      onStatusChangeCallback?.("Disconnected");
    };

    client.onDisconnect = () => {
      isConnected = false;
      onStatusChangeCallback?.("Disconnected");
    };

    client.activate();
  },

  sendMessage: (receiverId, messageText) => {
    if (!client || !isConnected) {
      console.error("Transmission channel unavailable: Network link offline.");
      return false;
    }

    const payloadDto = {
      receiverId: Number(receiverId),
      message: messageText,
      timestamp: new Date().toISOString()
    };

    client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payloadDto),
    });
    return true;
  },

  disconnect: () => {
    if (client) {
      client.deactivate();
      client = null;
      isConnected = false;
      onStatusChangeCallback?.("Disconnected");
    }
  }
};