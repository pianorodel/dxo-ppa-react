import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";

import "@/assets/scss/themes.scss";
import IdleNoticeModal from "@/components/Common/Modals/IdleNoticeModal";
import LogoutNoticeModal from "@/components/Common/Modals/LogoutNoticeModal";
import useIdleTimer from "@/components/Hooks/useIdleTimer";
import { useSignalRListener } from "@/components/Hooks/useSignalRListener";
import { useTabTitleNotifier } from "@/components/Hooks/useTabTitleNotifier";
import { SIGNALR_MESSAGE_TYPES } from "@/constants/signalrMessageTypes";
import { playSound } from "@/helpers/audioHelper";
import { getCookie } from "@/helpers/cookie_helper";
import { getCurrentUser } from "@/helpers/session_helper";
import Route from "@/routes";

// Idle Timer Configuration (in minutes)
const IDLE_TIMEOUT_MINUTES = 61;
const IDLE_WARNING_MINUTES = 1;

// Convert to milliseconds for timer
const IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MINUTES * 60 * 1000;
const IDLE_WARNING_MS = IDLE_WARNING_MINUTES * 60 * 1000;

// Convert to seconds for modal display
const IDLE_TIMEOUT_SECONDS = IDLE_TIMEOUT_MINUTES * 60;
const IDLE_WARNING_SECONDS = IDLE_WARNING_MINUTES * 60;

function App() {
  const location = useLocation();
  const { notifyTabTitle } = useTabTitleNotifier();
  const [toggleNoticeModal, setToggleNoticeModal] = useState(false);
  const [toggleIdleModal, setToggleIdleModal] = useState(false);

  const isLockScreen = location.pathname === "/lockscreen";

  useEffect(() => {
    if (isLockScreen) {
      const sessionUser = sessionStorage.getItem("currentUser");
      const backupUser = localStorage.getItem("lockscreen_user");
      if (!sessionUser && backupUser) {
        sessionStorage.setItem("currentUser", backupUser);
      }
      if (sessionUser) {
        localStorage.setItem("lockscreen_user", sessionUser);
      }
    } else {
      localStorage.removeItem("lockscreen_user");
    }
  }, [isLockScreen]);

  const isAuthenticated = Boolean(sessionStorage.getItem("currentUser"));

  const notify = (message) => {
    setTimeout(() => {
      const isLoggedIn = getCurrentUser();
      if (!isLoggedIn) return;

      playSound();
      notifyTabTitle();

      toast(
        <p
          style={{ position: "relative", zIndex: 10, cursor: "pointer" }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(message),
          }}
        />,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          className: "bg-success text-white",
        },
      );
    }, 0);
  };

  const otherDeviceLoginNotice = (message) => {
    setTimeout(() => {
      const user = getCurrentUser();
      const refreshToken = getCookie("refreshToken");

      if (user?.userId === message?.userId && user?.ipAddress !== message?.ipAddress) {
        if (message?.refreshToken !== refreshToken)
          setToggleNoticeModal(true);
      }
    }, 0);
  };

  const handlePrompt = () => {
    setToggleIdleModal(true);
    playSound();
    notifyTabTitle();
  };

  // Use custom idle timer hook with warning
  const { resetTimer } = useIdleTimer({
    timeout: IDLE_TIMEOUT_MS,
    promptTimeout: IDLE_WARNING_MS,
    onPrompt: handlePrompt,
    enabled: isAuthenticated && !isLockScreen,
  });

  useSignalRListener([
    {
      type: SIGNALR_MESSAGE_TYPES.NOTIFICATION,
      handler: notify,
    },
    {
      type: SIGNALR_MESSAGE_TYPES.CORE_LOGIN,
      handler: otherDeviceLoginNotice,
    },
  ]);

  const handleStayActive = () => {
    console.log("User chose to stay active - resetting timer");
    setToggleIdleModal(false);
    resetTimer();
  };

  return (
    <>
      {/* Other device login modal */}
      <LogoutNoticeModal
        show={toggleNoticeModal}
        onCloseClick={() => setToggleNoticeModal(false)}
      />

      {/* Idle timeout modal with countdown */}
      <IdleNoticeModal
        show={toggleIdleModal}
        onCloseClick={() => setToggleIdleModal(false)}
        onStayActive={handleStayActive}
        warningTime={IDLE_WARNING_SECONDS}
        totalIdleTime={IDLE_TIMEOUT_SECONDS}
      />

      <ToastContainer />
      <Route />
    </>
  );
}

export default App;