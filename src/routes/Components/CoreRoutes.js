import { lazy } from "react";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";

const Notifications = lazy(() => import("@/pages/Core/Notification/index"));
const Security_AuditLogs = lazy(() => import("@/pages/Security/AuditLogs/index"));
const Security_Roles = lazy(() => import("@/pages/Security/Roles/index"));
const Security_Users = lazy(() => import("@/pages/Security/Users/index"));
const Security_AccessRequests = lazy(() => import("@/pages/Security/AccessRequests/index"));

export var coreRoutes = [
    { path: "/notifications", component: <Notifications />, permissionTypeId: [] },

    { path: "/security/users", component: <Security_Users />, permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_SECURITY_USERS] },
    { path: "/security/roles", component: <Security_Roles />, permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_SECURITY_ROLES] },
    { path: "/security/auditLogs", component: <Security_AuditLogs />, permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_SECURITY_AUDITLOGS] },
    {
        path: "/security/accessrequests",
        component: <Security_AccessRequests />,
        permissionTypeId: [
            CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_VIEWER,
            CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_REQUESTOR,
            CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_APPROVER,
        ],
    },
];