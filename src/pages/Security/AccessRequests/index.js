import { useMemo } from "react";

import TransactionPage from "@/components/Common/TransactionPage";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { hasReadAccess, hasWriteAccess } from "@/helpers/session_helper";

import { useActionHandlers } from "./Components/ActionHandlers";
import { getAccessRequestColumns } from "./Components/Columns";
import { ModalRegistry } from "./Components/ModalRegistry";

import {
  useDeleteAccessRequestsMutation,
  useExportAccessRequestsMutation,
  useExportListForViewerAccessRequestsMutation,
  useGetAccessRequestsQuery,
  useGetListAccessRequestsForViewersQuery,
} from "@/api/Endpoints/Core/Transactions/AccessRequest/AccessRequests";

const VIEWER_RIGHTS = [CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_VIEWER];
const REQUESTOR_RIGHTS = [CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_REQUESTOR];

const REQUESTOR_APPROVER_RIGHTS = [
  CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_REQUESTOR,
  CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_APPROVER,
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

const BREAD_CRUMBS = [{ title: "Core", url: "/" }];

const AccessRequest = () => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();

  const [deleteMutation] = useDeleteAccessRequestsMutation();
  const [exportMutation] = useExportAccessRequestsMutation();
  const [exportListForViewerMutation] = useExportListForViewerAccessRequestsMutation();

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
    moduleName: "Access Request",
    columnKey: "accessRequestId",
  });

  const resolvedQuery = useMemo(
    () => (isViewerOnly ? useGetListAccessRequestsForViewersQuery : useGetAccessRequestsQuery),
    [isViewerOnly],
  );

  return (
    <TransactionPage
      title="Access Requests"
      moduleName="Access Request"
      useGetQuery={resolvedQuery}
      getColumns={getAccessRequestColumns}
      columnKey="accessRequestId"
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

export default AccessRequest;
