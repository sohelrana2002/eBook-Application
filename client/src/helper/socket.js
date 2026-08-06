import { io } from "socket.io-client";

let socketInstance = null;

const isDev = process.env.NODE_ENV === "development";

export const connectSocket = (token) => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  const url = process.env.NEXT_PUBLIC_BASE_URL;

  if (isDev) {
    console.log("Connecting to Socket.IO at: ", url);
  }

  socketInstance = io(url, {
    auth: { token },
    transports: ["polling", "websocket"],
    timeout: 120000,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socketInstance.on("connect", () => {
    if (isDev) {
      console.log("Socket connected successfully!");
    }
  });

  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error: ", err.message);
  });

  socketInstance.on("disconnect", (reason) => {
    if (isDev) {
      console.log("Socket disconnected:", reason);
    }
  });

  return socketInstance;
};
