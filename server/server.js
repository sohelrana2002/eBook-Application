import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDatabase from "./src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const startServer = async () => {
  await connectDatabase();

  const port = config.port || 3001;

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3001",
        "https://e-book-application-five.vercel.app",
        "https://e-book-application-admin.vercel.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  // Socket.IO JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, config.jwtSecretKey);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // Event handlers after authentication
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user?.name || socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.name || socket.id);
    });
  });

  // When a new book is added anywhere
  const sendNewBookNotification = (book) => {
    io.emit("new_book", book); // send to ALL connected users
  };

  // When a book is deleted
  const sendDeletedBookNotification = (bookId) => {
    io.emit("delete_book", bookId); // remove from ALL connected users
  };

  app.set("io", io);

  httpServer.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
