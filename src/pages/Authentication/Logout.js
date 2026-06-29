import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
    setIsLoggedOut(true);
  }, []);

  return isLoggedOut ? <Navigate to="/login" /> : null;
};

export default Logout;