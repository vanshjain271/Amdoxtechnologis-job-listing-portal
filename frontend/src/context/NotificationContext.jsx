import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5001/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchNotifications();

      // Initialize Socket.io
      const newSocket = io("http://localhost:5001", {
        auth: { token },
      });

      newSocket.emit("join", user.id);

      newSocket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Browser notification if permitted
        if (Notification.permission === "granted") {
          new Intl.DateTimeFormat().format(new Date());
          new window.Notification(notification.title, {
            body: notification.message,
          });
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user, token, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch("http://localhost:5001/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllRead,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
