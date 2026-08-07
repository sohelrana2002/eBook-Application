import { io } from "socket.io-client";

let socketInstance = null;

const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "development";

export const connectSocket = (token) => {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  }

  if (isDev) {
    console.log("Connecting to Socket.IO at: ", url);
  }

  socketInstance = io(url, {
    auth: { token },
    transports: ["polling", "websocket"],
    timeout: 120000,
    reconnection: true,
    reconnectionAttempts: 15,
    reconnectionDelay: 3000,
    autoConnect: true,
  });

  socketInstance.on("connect", () => {
    if (isDev) {
      console.log("Socket connected successfully!");
    }
  });

  socketInstance.on("connect_error", (err) => {
    if (isDev) {
      console.warn(
        "Socket is trying to connect (Server may be cold-starting):",
        err.message,
      );
    }
  });

  socketInstance.on("error", (err) => {
    if (isDev) {
      console.error("Socket runtime error:", err);
    }
  });

  socketInstance.on("disconnect", (reason) => {
    if (isDev) {
      console.log("Socket disconnected:", reason);
    }
  });

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
};
