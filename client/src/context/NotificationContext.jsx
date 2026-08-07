"use client";

import { createContext, useState, useEffect } from "react";
import { connectSocket } from "@/helper/socket";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        const savedAlerts = JSON.parse(
          localStorage.getItem("notifications") || "[]",
        );
        setAlerts(savedAlerts);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setAlerts([]);
      return;
    }

    const newSocket = connectSocket(token);
    setSocket(newSocket);

    const handleNewBook = (data) => {
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      data.read = false;

      setAlerts((prev) => {
        const updated = [...prev, data];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    };

    const handleDeleteBook = (bookId) => {
      setAlerts((prev) => {
        const updated = prev.filter((a) => a.id !== bookId);
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
