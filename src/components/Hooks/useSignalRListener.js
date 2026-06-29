import { useEffect, useRef } from "react";

import { useSignalR } from "@/context/signalRContext";

// sample usage:

// 1 message type + handler
// useSignalRListener({
//     type: SIGNALR_MESSAGE_TYPE.SUCCESS,
//     handler: (msg) => toast.success(msg),
// });

// multiple types sharing the same handler
// useSignalRListener({
//     type: [SIGNALR_MESSAGE_TYPE.SUCCESS, SIGNALR_MESSAGE_TYPE.INFO],
//     handler: (msg) => toast.success(msg),
// });

// multiple message type  + handler
// useSignalRListener([
//     {
//         type: SIGNALR_MESSAGE_TYPE.ERROR,
//         handler: (msg) => toast.error(msg),
//     },
//     {
//         type: [SIGNALR_MESSAGE_TYPE.SUCCESS, SIGNALR_MESSAGE_TYPE.INFO],
//         handler: (msg) => toast.success(msg),
//     },
// ]);

export const useSignalRListener = (input, options = {}) => {
  const connection = useSignalR();
  const handlersRef = useRef({});

  useEffect(() => {
    if (!connection || !input) return;

    const listeners = Array.isArray(input) ? input : [input];

    listeners.forEach(({ type, handler }) => {
      const types = Array.isArray(type) ? type : [type];

      const wrappedHandler = (payload) => {
        let parsed = payload;
        if (payload && typeof payload === "string") {
          try {
            parsed = JSON.parse(payload);
          } catch {
            parsed = payload;
          }
        }

        if (options.debounceMs) {
          const debounceKey = types.join("|");
          clearTimeout(handlersRef.current[`debounce_${debounceKey}`]);
          handlersRef.current[`debounce_${debounceKey}`] = setTimeout(() => {
            handler(parsed);
          }, options.debounceMs);
        } else {
          // ← defer to next tick so the browser's message handler
          //   returns immediately, avoiding the [Violation] warning
          setTimeout(() => handler(parsed), 0);
        }
      };

      types.forEach((t) => {
        connection.on(t, wrappedHandler);
        handlersRef.current[t] = wrappedHandler;
      });
    });

    return () => {
      listeners.forEach(({ type }) => {
        const types = Array.isArray(type) ? type : [type];
        types.forEach((t) => {
          connection.off(t, handlersRef.current[t]);
          delete handlersRef.current[t];
        });

        const debounceKey = types.join("|");
        clearTimeout(handlersRef.current[`debounce_${debounceKey}`]);
        delete handlersRef.current[`debounce_${debounceKey}`];
      });
    };
  }, [connection, input, options.debounceMs]);
};