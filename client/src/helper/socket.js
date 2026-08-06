import { io } from "socket.io-client";

let socketInstance = null;

export const connectSocket = (token) => {
  // আগের সকেট থাকলে ডিসকানেক্ট করুন
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  const url = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("🟡 Connecting to Socket.IO at:", url);

  // ✅ শুধু polling ব্যবহার করুন (WebSocket বাদ)
  socketInstance = io(url, {
    auth: { token },
    transports: ["polling"], // শুধু polling
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  // সাফল্য/ব্যর্থতা লগ
  socketInstance.on("connect", () => {
    console.log("✅ Socket connected successfully via polling");
  });

  socketInstance.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
    // যদি Auth error হয়, তাহলে টোকেন সমস্যা
    if (err.message === "Authentication error") {
      console.warn("⚠️ Token invalid or missing. Please login again.");
    }
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
