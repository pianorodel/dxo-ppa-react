import DeleteModal from "@/components/Common/Modals/DeleteModal";
import ExportExcelModal from "@/components/Common/Modals/ExportExcelModal";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import ModernAuditLogsModal from "@/components/Common/Modals/ModernAuditLogsModal";

import SaveModal from "./SaveModal";
import ViewDetails from "./ViewDetails";

import { useGetAccessRequestLogsQuery } from "@/api/Endpoints/Core/Transactions/AccessRequest/AccessRequestLogs";

export const ModalRegistry = {
  export: {
    toggleKey: "toggleExport",
    component: ExportExcelModal,
    getProps: ({ state, handlers, title, statusIds }) => ({
      show: state.toggle.toggleExport,
      onCloseClick: (e) => handlers.handleExport(e, { ...state.pageDetails, statusIds }),
      title: `Export List of ${title}`,
    }),
  },
  delete: {
    toggleKey: "toggleDelete",
    component: DeleteModal,
    getProps: ({ state, handlers, moduleName, codeField, columnKey }) => ({
      show: state.toggle.toggleDelete,
      title: `Delete ${moduleName} ${state.trxValue?.[codeField] || ""}`,
      onDeleteClick: () =>
        handlers.handleDeleteItem(state.trxValue?.[columnKey]),
      onCloseClick: () => handlers.handleActions("delete"),
    }),
  },
  update: {
    toggleKey: "toggleUpdate",
    component: SaveModal,
    getProps: ({ state, handlers }) => ({
      show: state.toggle.toggleUpdate,
      data: state.trxValue,
      accessRights: [
        CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_REQUESTOR,
        CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_APPROVER
      ],
      onCloseClick: () => handlers.handleActions("update"),
      refetchParentList: () => handlers.refetchParentList(),
    }),
  },
  logs: {
    toggleKey: "toggleAuditLogs",
    component: ModernAuditLogsModal,
    getProps: ({ state, handlers }) => ({
      show: state.toggle.toggleAuditLogs,
      title: "Access Request History",
      subTitle: state?.trxValue?.referenceNo || "",
      transactionId: state?.trxValue?.accessRequestId || 0,
      data: state?.trxValue,
      useLogsQuery: useGetAccessRequestLogsQuery,
      idKey: "accessRequestId",
      onClose: () => handlers.handleActions("logs"),
    }),
  },

  viewDetails: {
    toggleKey: "toggleViewDetails",
    component: ViewDetails,
    getProps: ({ state, handlers }) => ({
      show: state.toggle.toggleViewDetails,
      data: state.trxValue,
      parentKey: state.parentKey || 1,
      onCloseClick: () => handlers.handleActions("viewDetails"),
      onUpdateParentKey: (parentKey) => handlers.handleUpdateParentKey(parentKey),
    }),
  },
};
