import { useEffect, useState } from "react";

const PacmanLoader = ({ loadingText = "Loading Please Wait..." }) => {
  const [themeVars, setThemeVars] = useState({
    bodyColor: "#000",
    whiteColor: "#fff",
  });

  useEffect(() => {
    const updateThemeVars = () => {
      const root = document.documentElement;
      setThemeVars({
        bodyColor: getComputedStyle(root).getPropertyValue("--vz-body-color").trim() || "#000",
        whiteColor: getComputedStyle(root).getPropertyValue("--vz-white").trim() || "#fff",
      });
    };

    updateThemeVars();

    const observer = new MutationObserver(updateThemeVars);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  const pacmanColor = "#EFF107";

  return (
    <>
      <style>
        {`
        .loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-height: 80px;
          position: relative;
          text-align: center;
        }

        .loader-animation {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .packman {
          position: relative;
          width: 50px;
          height: 50px;
        }

        .packman::before {
          content: '';
          position: absolute;
          width: 50px;
          height: 25px;
          background-color: ${pacmanColor};
          border-radius: 100px 100px 0 0;
          transform: translate(-50%, -50%);
          animation: pac-top 0.5s linear infinite;
          transform-origin: center bottom;
          left: 50%;
          top: 50%;
        }

        .packman::after {
          content: '';
          position: absolute;
          width: 50px;
          height: 25px;
          background-color: ${pacmanColor};
          border-radius: 0 0 100px 100px;
          transform: translate(-50%, 50%);
          animation: pac-bot 0.5s linear infinite;
          transform-origin: center top;
          left: 50%;
          top: 50%;
        }

        @keyframes pac-top {
          0% { transform: translate(-50%, -50%) rotate(0); }
          50% { transform: translate(-50%, -50%) rotate(-30deg); }
          100% { transform: translate(-50%, -50%) rotate(0); }
        }

        @keyframes pac-bot {
          0% { transform: translate(-50%, 50%) rotate(0); }
          50% { transform: translate(-50%, 50%) rotate(30deg); }
          100% { transform: translate(-50%, 50%) rotate(0); }
        }

        .dots {
          position: relative;
          margin-left: 10px;
        }

        .dots .dot {
          position: absolute;
          top: 8px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${themeVars.bodyColor};
        }

        .dots .dot:nth-child(1) {
          left: 0px;
          animation: dot-stage1 0.5s infinite;
        }

        .dots .dot:nth-child(2) {
          left: 30px;
          animation: dot-stage1 0.5s infinite;
        }

        .dots .dot:nth-child(3) {
          left: 60px;
          animation: dot-stage1 0.5s infinite;
        }

        .dots .dot:nth-child(4) {
          left: 90px;
          animation: dot-stage2 0.5s infinite;
        }

        @keyframes dot-stage1 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-24px, 0); }
        }

        @keyframes dot-stage2 {
          0% { transform: scale(1); }
          5%, 100% { transform: scale(0); }
        }

         .loading-text {
          margin-top: 20px; /* 👈 space below Pacman */
          font-size: 14px;
          font-weight: 500;
          color: ${themeVars.bodyColor};
          font-family: system-ui, sans-serif;
          opacity: 0.8;
          text-align: center;
          width: 100%;
        }
        `}
      </style>

      <div className="loader-wrapper">
        <div className="loader-animation">
          <div className="packman"></div>
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            {/* <div className="dot"></div>
                        <div className="dot"></div> */}
          </div>
        </div>
        <div className="loading-text">&nbsp;&nbsp;&nbsp;{loadingText}</div>
      </div>
    </>
  );
};

export default PacmanLoader;
