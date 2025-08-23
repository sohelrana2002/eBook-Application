"use client";

import { formatDistanceToNow } from "date-fns";
import { useNotificationContext } from "@/context/notificationContext";

export default function Notifications() {
  const { alerts, setAlerts } = useNotificationContext();

  const handleClick = (alert) => {
    // Mark the clicked notification as read
    const updatedAlerts = alerts.map((a) =>
      a.id === alert.id ? { ...a, read: true } : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem("notifications", JSON.stringify(updatedAlerts));

    // Navigate to the book page
    window.location.href = `/books/${alert.id}`;
  };

  return (
    <div className="relative">
      <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border shadow-lg rounded">
        {alerts.length === 0 && (
          <p className="p-2 text-gray-500">No notifications</p>
        )}
        {alerts
          .slice()
          .reverse() // newest on top
          .map((alert, index) => (
            <div
              key={index}
              onClick={() => handleClick(alert)}
              className={`cursor-pointer hover:bg-gray-100 p-2 flex justify-between ${
                alert.read ? "bg-gray-50" : "bg-white font-medium"
              }`}
            >
              <div>
                Added a new book {alert.title} by {alert.author}
              </div>
              <div className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(alert.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
