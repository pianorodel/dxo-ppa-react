import { Navigate } from "react-router-dom";

// ─── Per-system route slices ──────────────────────────────────────────────────
import { authPublicRoutes } from "./Components/AuthRoutes";
import { coreRoutes } from "./Components/CoreRoutes";

import { fmsRoutes } from "./Components/FMSRoutes";

// ─── Assembled route tables ───────────────────────────────────────────────────
export var authProtectedRoutes = [
    ...coreRoutes,

    ...fmsRoutes,

    // Catch-alls — must stay last
    { path: "/", exact: true, component: <Navigate to="/fms/dashboard" /> },
    { path: "*", component: <Navigate to="/coming-soon" /> },
];

export var publicRoutes = [
    ...authPublicRoutes,
];