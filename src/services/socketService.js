import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { store } from '../redux/store';

let client = null;
let isConnected = false;
let isConnecting = false;
let onStatusChangeCallback = null;
let reconnectAttempts = 0;
let pendingMessages = [];

export const socketService = {
  connect: (onStatusChange, onMessageReceived) => {
    if (client && isConnected) {
      console.log("✅ SocketService: Already Connected!");
      return;
    }

    if (isConnecting) {
      console.log("⏳ SocketService: Connection already in progress...");
      return;
    }

    if (client) {
      try {
        client.deactivate();
      } catch (e) {
        console.warn("Error deactivating existing client:", e);
      }
      client = null;
      isConnected = false;
      isConnecting = false;
    }

    const state = store.getState();
    const token = state.auth?.token;
    console.log("🔑 Socket token:", token ? "Token present" : "No token");

    if (!token || token === 'null' || token.trim() === '') {
      console.error("❌ SocketService: Token not found!");
      if (onStatusChange) onStatusChange("Error", "No token found");
      return;
    }

    // ✅ Use the correct URL - same as your API base URL but with different port
    // Note: Your API uses port 8082, but WebSocket uses port 8080
    //const serverUrl = "http://192.168.29.108:8082/ws-sockjs";
     const serverUrl = "https://vynkdating.com/ws-sockjs";
    console.log("🌐 Connecting to WebSocket:", serverUrl);
    
    if (onStatusChange) onStatusChangeCallback = onStatusChange;
    onStatusChangeCallback?.("Connecting...", null);

    reconnectAttempts = 0;
    isConnecting = true;
    pendingMessages = [];

    client = new Client({
      webSocketFactory: () => {
        console.log("🔌 Creating WebSocket connection via SockJS...");
        return new SockJS(serverUrl, null, {
          timeout: 30000,
          transports: ['websocket', 'xhr-polling'],
        });
      },
      connectHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: (retryCount) => {
        const delay = Math.min(5000 * Math.pow(1.5, retryCount), 30000);
        console.log(`🔄 Reconnection attempt ${retryCount + 1} in ${delay/1000}s`);
        return delay;
      },
      maxRetryDelay: 60000,
      debug: (str) => {
        console.log('🐛 STOMP Debug:', str);
      }
    });

    client.onConnect = (frame) => {
      console.log("✅✅✅ STOMP Connected successfully!", frame);
      isConnected = true;
      isConnecting = false;
      reconnectAttempts = 0;
      onStatusChangeCallback?.("Connected", null);

      try {
        client.subscribe('/user/queue/messages', (messagePayload) => {
          if (messagePayload.body) {
            try {
              const incomingData = JSON.parse(messagePayload.body);
              console.log("📨 Message received:", incomingData);
              if (onMessageReceived) onMessageReceived(incomingData);
            } catch (e) {
              console.error("Error parsing inbound message:", e);
            }
          }
        });
        console.log("📡 Subscribed to /user/queue/messages");
        
        if (pendingMessages.length > 0) {
          console.log(`📤 Processing ${pendingMessages.length} pending messages...`);
          const messagesToSend = [...pendingMessages];
          pendingMessages = [];
          messagesToSend.forEach(({ receiverId, messageText }) => {
            socketService.sendMessage(receiverId, messageText);
          });
        }
      } catch (e) {
        console.error("Error subscribing to queue:", e);
      }
    };

    client.onStompError = (frame) => {
      isConnected = false;
      isConnecting = false;
      const errorMsg = frame.headers['message'] || 'STOMP protocol error';
      console.error("❌ STOMP protocol error:", errorMsg);
      console.error("Headers:", frame.headers);
      console.error("Body:", frame.body);
      onStatusChangeCallback?.("Error", errorMsg);
    };

    client.onWebSocketError = (event) => {
      isConnected = false;
      isConnecting = false;
      console.error("❌ WebSocket error:", event);
      onStatusChangeCallback?.("Error", "WebSocket connection error");
    };

    client.onWebSocketClose = (event) => {
      isConnected = false;
      isConnecting = false;
      console.warn(`⚠️ WebSocket closed - Code: ${event.code}, Reason: ${event.reason || 'No reason'}`);
      
      if (event.code === 1002 || event.code === 1006) {
        console.error("❌ Connection failed!");
        console.error("📋 The backend returned: Unauthorized");
        console.error("📋 This means:");
        console.error("  1. WebSocket endpoint requires authentication");
        console.error("  2. But it should be public in SecurityConfig");
        console.error("  3. Check: .antMatchers('/ws-sockjs/**').permitAll()");
        console.error("  4. Is your Spring Boot Security configured correctly?");
      }
      onStatusChangeCallback?.("Disconnected", "Connection closed");
    };

    client.onDisconnect = () => {
      isConnected = false;
      isConnecting = false;
      console.warn("⚠️ STOMP disconnected");
      onStatusChangeCallback?.("Disconnected", "Connection lost");
    };

    console.log("🚀 Activating STOMP client...");
    try {
      client.activate();
    } catch (e) {
      console.error("❌ Failed to activate:", e);
      isConnecting = false;
      onStatusChangeCallback?.("Error", "Failed to start connection");
    }
  },

  sendMessage: (receiverId, messageText) => {
    if (!receiverId || !messageText || messageText.trim() === '') {
      console.error("❌ Invalid message parameters");
      return false;
    }

    if (!isConnected) {
      console.log("⏳ Not connected, queuing message...");
      pendingMessages.push({ receiverId, messageText: messageText.trim() });
      console.log(`📋 ${pendingMessages.length} messages in queue`);
      return true;
    }

    if (!client) {
      console.error("❌ Cannot send message - Client not initialized");
      pendingMessages.push({ receiverId, messageText: messageText.trim() });
      return true;
    }

    try {
      const payloadDto = {
        receiverId: Number(receiverId),
        message: messageText.trim(),
        timestamp: new Date().toISOString()
      };

      console.log(`📤 Sending message to ${receiverId}:`, payloadDto);
      
      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payloadDto),
        headers: {
          'content-type': 'application/json',
        }
      });
      
      console.log("✅ Message sent successfully");
      return true;
    } catch (e) {
      console.error("❌ Error sending message:", e);
      return false;
    }
  },

  disconnect: () => {
    if (client) {
      try {
        console.log("🔌 Disconnecting STOMP client...");
        client.deactivate();
      } catch (e) {
        console.error("Error during disconnect:", e);
      } finally {
        client = null;
        isConnected = false;
        isConnecting = false;
        pendingMessages = [];
        onStatusChangeCallback?.("Disconnected", "Manual disconnect");
        onStatusChangeCallback = null;
      }
    }
  },

  getStatus: () => {
    return {
      isConnected,
      isConnecting,
      hasClient: !!client,
      pendingMessages: pendingMessages.length,
      clientConnected: client?.connected || false
    };
  },

  clearPendingMessages: () => {
    pendingMessages = [];
    console.log("🧹 Pending messages cleared");
  }
};

export default socketService;