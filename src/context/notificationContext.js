import React, { createContext, useContext } from "react";

import { useNotificationModal as useNotification } from "@/components/Hooks/useNotificationModal";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { notification, hideModal, NotificationContainer } = useNotification();

  return (
    <NotificationContext.Provider value={{ notification, hideModal, NotificationContainer }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useNotificationModal = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotificationModalContext must be used within NotificationProvider");
  }
  return ctx;
};
