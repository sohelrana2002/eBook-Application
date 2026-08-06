import { createContext, useState, useEffect, useContext } from "react";
import { connectSocket } from "@/helper/socket";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load notifications only if user is logged in
  useEffect(() => {
    if (!token) {
      setAlerts([]);
      return;
    }

    const savedAlerts = JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    setAlerts(savedAlerts);
  }, [token]);

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

    // When new book is added
    newSocket.on("new_book", (data) => {
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      data.read = false;

      setAlerts((prev) => {
        const updated = [...prev, data];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    });

    // When a book is deleted
    newSocket.on("delete_book", (bookId) => {
      setAlerts((prev) => {
        const updated = prev.filter((a) => a.id !== bookId);
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      newSocket.off("new_book");
      newSocket.off("delete_book");
      newSocket.disconnect();
      setSocket(null);
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

export { NotificationProvider, NotificationContext };
