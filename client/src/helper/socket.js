import { io } from "socket.io-client";

let socketInstance = null;

export const connectSocket = (token) => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL, {
    auth: { token },
    transports: ["websocket", "polling"], // polling fallback
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // error handling
  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error: ", err.message);
  });

  // disconnect issues
  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected: ", reason);
  });

  return socketInstance;
};
