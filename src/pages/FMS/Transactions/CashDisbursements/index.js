import { useMemo } from "react";

import TransactionPage from "@/components/Common/TransactionPage";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { hasReadAccess, hasWriteAccess } from "@/helpers/session_helper";

import { useActionHandlers } from "./Components/ActionHandlers";
import { getCashDisbursementColumns } from "./Components/Columns";
import { ModalRegistry } from "./Components/ModalRegistry";

import {
  useDeleteCashDisbursementsMutation,
  useExportCashDisbursementsMutation,
  useGetCashDisbursementsQuery,
  useGetListCashDisbursementsForViewersQuery,
} from "@/api/Endpoints/FMS/Transactions/CashDisbursement/CashDisbursements";

const VIEWER_RIGHTS = [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CASHDISBURSEMENTS_VIEWER];
const REQUESTOR_RIGHTS = [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CASHDISBURSEMENTS_REQUESTOR];

const REQUESTOR_APPROVER_RIGHTS = [
  FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CASHDISBURSEMENTS_REQUESTOR,
  FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CASHDISBURSEMENTS_APPROVER,
];

const TABS = [
  {
    key: "1",
    label: "Pending",
    statusIds: [1, 2, 3],
    icon: "ri-loader-4-line",
    accessRights: REQUESTOR_APPROVER_RIGHTS,
  },
  {
    key: "2",
    label: "Completed",
    statusIds: [4, 5],
    icon: "ri-check-double-line",
    accessRights: REQUESTOR_APPROVER_RIGHTS,
  },
  {
    key: "3",
    label: "Cancelled",
    statusIds: [6],
    icon: "ri-close-line",
    accessRights: REQUESTOR_RIGHTS,
  },
  {
    key: "4",
    label: "All",
    statusIds: [],
    icon: "ri-file-list-line",
    accessRights: REQUESTOR_APPROVER_RIGHTS,
  },
];

const BREAD_CRUMBS =
  [
    { title: "FMS", url: "/fms/dashboard" },
  ];

const CashDisbursement = () => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();

  const [deleteMutation] = useDeleteCashDisbursementsMutation();
  const [exportMutation] = useExportCashDisbursementsMutation();

  const isViewerOnly = useMemo(
    () =>
      hasReadAccess(VIEWER_RIGHTS) &&
      !hasWriteAccess(REQUESTOR_APPROVER_RIGHTS),
    [],
  );

  const handlers = useActionHandlers({
    customFunction,
    deleteMutation,
    exportMutation,
    notification,
    moduleName: "Cash Disbursement",
    columnKey: "cashDisbursementId",
  });

  const resolvedQuery = useMemo(
    () => (isViewerOnly ? useGetListCashDisbursementsForViewersQuery : useGetCashDisbursementsQuery),
    [isViewerOnly],
  );

  return (
    <TransactionPage
      title="Cash Disbursements"
      moduleName="Cash Disbursement"
      useGetQuery={resolvedQuery}
      getColumns={getCashDisbursementColumns}
      columnKey="cashDisbursementId"
      codeField="referenceNo"
      breadCrumbs={BREAD_CRUMBS}
      modalRegistry={ModalRegistry}
      handlers={handlers}
      state={state}
      customFunction={customFunction}
      requestorAccessRights={REQUESTOR_RIGHTS}
      isShowTabs={!isViewerOnly}
      tabs={TABS}
    />
  );
};

export default CashDisbursement;
