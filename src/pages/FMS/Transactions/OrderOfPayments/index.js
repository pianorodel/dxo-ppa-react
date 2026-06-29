import { memo, useCallback, useMemo } from "react";

import MultipleFileRenderer from "@/components/Common/MultipleFileRenderer";
import TransactionPage from "@/components/Common/TransactionPage";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { hasReadAccess, hasWriteAccess } from "@/helpers/session_helper";

import { useActionHandlers } from "./Components/ActionHandlers";
import { getOrderOfPaymentColumns } from "./Components/Columns";
import { ModalRegistry } from "./Components/ModalRegistry";

import {
  useDeleteOrderOfPaymentsMutation,
  useExportListForViewerOrderOfPaymentsMutation,
  useExportOrderOfPaymentsMutation,
  useGetListOrderOfPaymentsForViewersQuery,
  useGetOrderOfPaymentsQuery,
} from "@/api/Endpoints/FMS/Transactions/OrderOfPayment/OrderOfPayments";

const VIEWER_RIGHTS = [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_ORDEROFPAYMENTS_VIEWER];
const REQUESTOR_RIGHTS = [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_ORDEROFPAYMENTS_REQUESTOR];
const REQUESTOR_APPROVER_RIGHTS = [
  FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_ORDEROFPAYMENTS_REQUESTOR,
  FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_ORDEROFPAYMENTS_APPROVER,
];

const ExpandedRow = memo(({ row }) => (
  <div className="mb-3">
    <MultipleFileRenderer files={row?.original?.files || []} />
  </div>
));

ExpandedRow.displayName = "ExpandedRow";

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

const OrderOfPayment = () => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();

  const [deleteMutation] = useDeleteOrderOfPaymentsMutation();
  const [exportMutation] = useExportOrderOfPaymentsMutation();
  const [exportListForViewerMutation] = useExportListForViewerOrderOfPaymentsMutation();

  const isViewerOnly = useMemo(
    () =>
      hasReadAccess(VIEWER_RIGHTS) &&
      !hasWriteAccess(REQUESTOR_APPROVER_RIGHTS),
    [],
  );

  const resolvedExportMutation = useMemo(
    () => (isViewerOnly ? exportListForViewerMutation : exportMutation),
    [isViewerOnly, exportListForViewerMutation, exportMutation],
  );

  const handlers = useActionHandlers({
    customFunction,
    deleteMutation,
    exportMutation: resolvedExportMutation,
    notification,
    moduleName: "Order Of Payment",
    columnKey: "orderOfPaymentId",
  });

  const renderExpandedRow = useCallback((row) => <ExpandedRow row={row} />, []);

  const resolvedQuery = useMemo(
    () => (isViewerOnly ? useGetListOrderOfPaymentsForViewersQuery : useGetOrderOfPaymentsQuery),
    [isViewerOnly],
  );

  return (
    <TransactionPage
      title="Order Of Payments"
      moduleName="Order Of Payment"
      useGetQuery={resolvedQuery}
      getColumns={getOrderOfPaymentColumns}
      columnKey="orderOfPaymentId"
      codeField="referenceNo"
      breadCrumbs={BREAD_CRUMBS}
      modalRegistry={ModalRegistry}
      handlers={handlers}
      state={state}
      customFunction={customFunction}
      requestorAccessRights={REQUESTOR_RIGHTS}
      isShowTabs={!isViewerOnly}
      tabs={TABS}
      renderExpandedRow={renderExpandedRow}
    />
  );
};

export default OrderOfPayment;
