import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";

export var coreMenuItems = [
    { label: "SYSTEMS", isHeader: true },
    {
        id: "MainDashboard", label: "Dashboard", icon: "ri-bar-chart-2-fill",
        link: "/", click: function (e) { /* setIscurrentState injected */ },
    },

    {
        label: "Security", isHeader: true,
        permissionTypeId: [
            CORE_ACCESS_RIGHTS.CORE_SECURITY_USERS,
            CORE_ACCESS_RIGHTS.CORE_SECURITY_ROLES,
            CORE_ACCESS_RIGHTS.CORE_SECURITY_AUDITLOGS,
            CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_VIEWER,
            CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_REQUESTOR,
            CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_APPROVER]
    },
    {
        id: "Users", label: "Users", icon: "ri-admin-fill", link: "/security/users",
        permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_SECURITY_USERS]
    },
    {
        id: "Roles", label: "Roles", icon: "ri-lock-unlock-fill", link: "/security/roles",
        permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_SECURITY_ROLES]
    },
    {
        id: "AuditLogs", label: "Audit Logs", icon: "ri-shield-flash-fill", link: "/security/auditLogs",
        permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_SECURITY_AUDITLOGS]
    },
    {
        id: "AccessRequests", label: "Access Requests", icon: "ri-key-fill", link: "/security/accessrequests",
        permissionTypeId: [CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_VIEWER, CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_REQUESTOR, CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_APPROVER]
    },
];