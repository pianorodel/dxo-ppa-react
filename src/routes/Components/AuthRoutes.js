import { lazy } from "react";

const ResetPassword = lazy(() => import("@/pages/Authentication/ResetPassword"));
const LockScreen = lazy(() => import("@/pages/Authentication/LockScreen"));
const ExpiredToken = lazy(() => import("@/pages/Authentication/ExpiredToken"));
const Logout = lazy(() => import("@/pages/Authentication/Logout"));
const ForgetPassword = lazy(() => import("@/pages/Authentication/ForgetPassword"));

const Alt404 = lazy(() => import("@/pages/AuthenticationInner/Errors/Alt404"));
const Basic404 = lazy(() => import("@/pages/AuthenticationInner/Errors/Basic404"));
const Error500 = lazy(() => import("@/pages/AuthenticationInner/Errors/Error500"));
const Offlinepage = lazy(() => import("@/pages/AuthenticationInner/Errors/Offlinepage"));

const ComingSoon = lazy(() => import("@/pages/Others/ComingSoon/ComingSoon"));
const Maintenance = lazy(() => import("@/pages/Others/Maintenance/Maintenance"));
const NotFound = lazy(() => import("@/pages/Others/NotFound/NotFound"));
const AuthPage  = lazy(() => import("@/pages/Authentication/AuthPage"));
const Register  = lazy(() => import("@/pages/Authentication/Register"));


export var authPublicRoutes = [
    { path: "/logout", component: <Logout /> },
    { path: "/login", component: <AuthPage /> },
    { path: "/register", component: <Register /> },
    { path: "/forgot-password", component: <ForgetPassword /> },
    { path: "/lockscreen", component: <LockScreen /> },
    { path: "/reset-password", component: <ResetPassword /> },
    { path: "/expired-token", component: <ExpiredToken /> },
    { path: "/auth-404-basic", component: <Basic404 /> },
    { path: "/auth-404-alt", component: <Alt404 /> },
    { path: "/auth-500", component: <Error500 /> },
    { path: "/auth-offline", component: <Offlinepage /> },
    { path: "/not-found", component: <NotFound /> },
    { path: "/under-maintenance", component: <Maintenance /> },
    { path: "/coming-soon", component: <ComingSoon /> },
];