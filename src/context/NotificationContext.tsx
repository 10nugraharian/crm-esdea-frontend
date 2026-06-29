"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "approval_request" | "approval_result" | "info";
  link?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notif: Omit<NotificationItem, "id" | "time" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Request Approval Quotation",
      message: "Rian Nugraha mengajukan quotation untuk PT. Alpha.",
      time: "10 menit yang lalu",
      isRead: false,
      type: "approval_request",
      link: "/finance"
    },
    {
      id: "notif-2",
      title: "Approval Invoice",
      message: "Invoice INV-001 (PT. Migas Beta) disetujui.",
      time: "1 jam yang lalu",
      isRead: true,
      type: "approval_result",
      link: "/invoices"
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (notif: Omit<NotificationItem, "id" | "time" | "isRead">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: "Baru saja",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
