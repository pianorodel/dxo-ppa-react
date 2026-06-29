import { getCurrentUser } from "@/helpers/session_helper";
import * as signalR from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {

    const accessToken = getCurrentUser()?.token;

    if (!accessToken) {
      return;
    }

    const hubUrl = `${process.env.REACT_APP_SIGNALR_API}?access_token=${accessToken}`;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        transport: signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.ServerSentEvents |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn.start()
      .then(() => {
        conn.on("userconnected", () => {});
        setConnection(conn);
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
      });

    return () => {
      conn.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
