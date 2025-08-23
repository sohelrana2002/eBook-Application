import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      auth: { token },
      transports: ["websocket"], // force websocket
    });
  }
  return socket;
};
