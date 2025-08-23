import { createContext, useState, useEffect, useContext } from "react";
import { connectSocket } from "@/helper/socket";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load saved notifications on mount
  useEffect(() => {
    const savedAlerts = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    setAlerts(savedAlerts);
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("new_book", (data) => {
      // Add timestamp and read flag
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      data.read = false;

      setAlerts((prev) => {
        const updated = [...prev, data];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.off("new_book");
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
