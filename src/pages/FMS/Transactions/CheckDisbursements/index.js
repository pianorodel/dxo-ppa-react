import { useMemo } from "react";

import TransactionPage from "@/components/Common/TransactionPage";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { hasReadAccess, hasWriteAccess } from "@/helpers/session_helper";

import { useActionHandlers } from "./Components/ActionHandlers";
import { getCheckDisbursementColumns } from "./Components/Columns";
import { ModalRegistry } from "./Components/ModalRegistry";

import {
  useDeleteCheckDisbursementsMutation,
  useExportCheckDisbursementsMutation,
  useGetCheckDisbursementsQuery,
  useGetListCheckDisbursementsForViewersQuery,
} from "@/api/Endpoints/FMS/Transactions/CheckDisbursement/CheckDisbursements";

const VIEWER_RIGHTS = [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CHECKDISBURSEMENTS_VIEWER];
const REQUESTOR_RIGHTS = [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CHECKDISBURSEMENTS_REQUESTOR];

const REQUESTOR_APPROVER_RIGHTS = [
  FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CHECKDISBURSEMENTS_REQUESTOR,
  FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CHECKDISBURSEMENTS_APPROVER,
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

const CheckDisbursement = () => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();

  const [deleteMutation] = useDeleteCheckDisbursementsMutation();
  const [exportMutation] = useExportCheckDisbursementsMutation();

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
    moduleName: "Check Disbursement",
    columnKey: "checkDisbursementId",
  });

  const resolvedQuery = useMemo(
    () => (isViewerOnly ? useGetListCheckDisbursementsForViewersQuery : useGetCheckDisbursementsQuery),
    [isViewerOnly],
  );

  return (
    <TransactionPage
      title="Check Disbursements"
      moduleName="Check Disbursement"
      useGetQuery={resolvedQuery}
      getColumns={getCheckDisbursementColumns}
      columnKey="checkDisbursementId"
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

export default CheckDisbursement;
