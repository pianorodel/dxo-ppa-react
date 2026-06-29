import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { apiStore } from "./api/Store/Store";
import { NotificationProvider } from "./context/notificationContext";
import { SignalRProvider } from "./context/signalRContext";
import { UnreadNotificationCountProvider } from "./context/unreadNotificationCountContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={apiStore}>
    <UnreadNotificationCountProvider>
      <NotificationProvider>
        <SignalRProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </SignalRProvider>
      </NotificationProvider>
    </UnreadNotificationCountProvider>
  </Provider>
);