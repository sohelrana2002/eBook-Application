"use client";

import { createContext, useState, useEffect } from "react";
import { connectSocket } from "@/helper/socket";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);

  // 1. Initial Load: Token and Notifications from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      try {
        const rawNotifications = localStorage.getItem("notifications");
        // Fallback added: If null or invalid, default to empty array []
        const savedAlerts = rawNotifications
          ? JSON.parse(rawNotifications)
          : [];
        setAlerts(Array.isArray(savedAlerts) ? savedAlerts : []);
      } catch (error) {
        console.error("Error parsing notifications from localStorage:", error);
        setAlerts([]);
      }
    }
  }, []);

  // 2. Socket Connection & Event Handling
  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = connectSocket(token);
    setSocket(newSocket);

    const handleNewBook = (data) => {
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      data.read = false;

      setAlerts((prev) => {
        // Safe check: Ensure prev is always an Array
        const safePrev = Array.isArray(prev) ? prev : [];
        const updated = [...safePrev, data];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    };

    const handleDeleteBook = (bookId) => {
      setAlerts((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const updated = safePrev.filter((a) => a.id !== bookId);
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    };

    newSocket.on("new_book", handleNewBook);
    newSocket.on("delete_book", handleDeleteBook);

    return () => {
      newSocket.off("new_book", handleNewBook);
      newSocket.off("delete_book", handleDeleteBook);
    };
  }, [token]);

  const value = {
    alerts,
    setAlerts,
    socket,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };
