import { createContext, useState, useEffect, useContext } from "react";
import { connectSocket } from "@/helper/socket";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load notifications only if user is logged in
  useEffect(() => {
    if (!token) {
      setAlerts([]);
      return;
    }

    const savedAlerts = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    setAlerts(savedAlerts);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    // When new book is added
    socket.on("new_book", (data) => {
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      data.read = false;

      setAlerts((prev) => {
        const updated = [...prev, data];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    });

    // When a book is deleted
    socket.on("delete_book", (bookId) => {
      setAlerts((prev) => {
        const updated = prev.filter((a) => a.id !== bookId);
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.off("new_book");
      socket.off("delete_book");
    };
  }, [token]);

  const value = {
    alerts,
    setAlerts,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export { NotificationProvider, useNotificationContext };
