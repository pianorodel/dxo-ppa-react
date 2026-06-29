import DeleteModal from "@/components/Common/Modals/DeleteModal";
import ExportExcelModal from "@/components/Common/Modals/ExportExcelModal";
import ModernAuditLogsModal from "@/components/Common/Modals/ModernAuditLogsModal";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { CORE_LOG_TYPES } from "@/constants/LogTypes";

import PermissionsModal from "./PermissionsModal";
import SaveModal from "./SaveModal";

export const rolesModalRegistry = {
  export: {
    toggleKey: "toggleExport",
    component: ExportExcelModal,
    getProps: ({ state, handlers, moduleName }) => ({
      show: state.toggle.toggleExport,
      onCloseClick: (e) => handlers.handleExport(e, state.pageDetails),
      title: `Export List of ${moduleName}`,
    }),
  },
  update: {
    toggleKey: "toggleUpdate",
    component: SaveModal,
    getProps: ({ state, handlers }) => ({
      show: state.toggle.toggleUpdate,
      data: state.trxValue,
      accessRights: CORE_ACCESS_RIGHTS.CORE_SECURITY_ROLES,
      onCloseClick: () => handlers.handleActions("update"),
    }),
  },
  delete: {
    toggleKey: "toggleDelete",
    component: DeleteModal,
    getProps: ({ state, handlers, moduleName, codeField, columnKey }) => ({
      show: state.toggle.toggleDelete,
      title: `Delete ${moduleName} ${state.trxValue?.[codeField] || ""}`,
      onDeleteClick: () => handlers.handleDeleteItem(state.trxValue?.[columnKey]),
      onCloseClick: () => handlers.handleActions("delete"),
    }),
  },
  permissions: {
    toggleKey: "togglePermissions",
    component: PermissionsModal,
    getProps: ({ state, handlers }) => ({
      show: state.toggle.togglePermissions,
      data: state.trxValue,
      onCloseClick: () => handlers.handleActions("permissions"),
    }),
  },
  logs: {
    toggleKey: "toggleAuditLogs",
    component: ModernAuditLogsModal,
    getProps: ({ state, handlers, codeField }) => ({
      show: state.toggle.toggleAuditLogs,
      title: "Audit Logs",
      subTitle: state?.trxValue?.[codeField] || "",
      transactionId: state?.trxValue?.roleId || 0,
      idKey: "referenceId",
      queryArg: { logType: CORE_LOG_TYPES.SECURITY_ROLES },
      onClose: () => handlers.handleActions("logs"),
    }),
  },
};
