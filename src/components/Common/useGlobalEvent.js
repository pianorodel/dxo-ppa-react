import { useEffect, useCallback } from "react";

export const useGlobalEvent = (eventName, handler) => {
  useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, handler]);
};

export const useGlobalDispatch = () => {
  const dispatch = useCallback((eventName, detail = {}) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }, []);

  return dispatch;
};