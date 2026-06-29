import React, { createContext, useContext, useCallback } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "@/helpers/session_helper";

import {
  useCountUnReadNotificationsQuery,
  notificationsAPI
} from "@/api/Endpoints/Core/Socials/Notifications";

const UnreadNotificationCountContext = createContext(null);

const currentUser = getCurrentUser();

export const UnreadNotificationCountProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { data } = useCountUnReadNotificationsQuery(undefined, {
    skip: !currentUser,
  });

  const count = data?.returnData ?? 0;

  const decrementCount = useCallback(() => {
    dispatch(
      notificationsAPI.util.updateQueryData( // ← notificationsAPI hindi notificationsApi
        "countUnReadNotifications",          // ← exact endpoint name: countUnRead + Notifications
        undefined,
        (draft) => {
          if (draft?.returnData > 0) {
            draft.returnData -= 1;
          }
        }
      )
    );
  }, [dispatch]);

  const incrementCount = useCallback(() => {
    dispatch(
      notificationsAPI.util.updateQueryData(
        "countUnReadNotifications",
        undefined,
        (draft) => {
          draft.returnData = (draft?.returnData ?? 0) + 1;
        }
      )
    );
  }, [dispatch]);

  const clearCount = useCallback(() => {
    dispatch(
      notificationsAPI.util.updateQueryData(
        "countUnReadNotifications",
        undefined,
        (draft) => {
          draft.returnData = 0;
        }
      )
    );
  }, [dispatch]);

  return (
    <UnreadNotificationCountContext.Provider
      value={{ count, decrementCount, incrementCount, clearCount }}
    >
      {children}
    </UnreadNotificationCountContext.Provider>
  );
};

export const useUnreadNotificationCount = () => {
  const ctx = useContext(UnreadNotificationCountContext);
  if (!ctx) {
    throw new Error(
      "useUnreadNotificationCount must be used within UnreadNotificationCountProvider"
    );
  }
  return ctx;
};