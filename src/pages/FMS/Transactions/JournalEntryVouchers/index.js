import TransactionPage from "@/components/Common/TransactionPage";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { hasReadAccess, hasWriteAccess } from "@/helpers/session_helper";

import { useActionHandlers } from "./Components/ActionHandlers";
import { getJournalEntryVoucherColumns } from "./Components/Columns";
import { ModalRegistry } from "./Components/ModalRegistry";

import {
  useDeleteJournalEntryVouchersMutation,
  useExportJournalEntryVouchersMutation,
  useGetJournalEntryVouchersQuery,
  useGetListJournalEntryVouchersForViewersQuery,
} from "@/api/Endpoints/FMS/Transactions/JournalEntryVoucher/JournalEntryVouchers";

const JournalEntryVoucher = () => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();

  const [deleteMutation] = useDeleteJournalEntryVouchersMutation();
  const [exportMutation] = useExportJournalEntryVouchersMutation();

  const handlers = useActionHandlers({
    customFunction,
    deleteMutation,
    exportMutation,
    notification,
    moduleName: "Journal Entry Voucher",
    columnKey: "journalEntryVoucherId",
  });

  const isViewerOnly =
    hasReadAccess(FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_VIEWER) &&
    !hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_REQUESTOR, FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_APPROVER]);

  const tabs = [
    {
      key: "1",
      label: "Pending",
      statusIds: [1, 2, 3],
      icon: "ri-loader-4-line",
      accessRights: [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_REQUESTOR, FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_APPROVER],
    },
    {
      key: "2",
      label: "Completed",
      statusIds: [4, 5],
      icon: "ri-check-double-line",
      accessRights: [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_REQUESTOR, FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_APPROVER],
    },
    {
      key: "3",
      label: "Cancelled",
      statusIds: [6],
      icon: "ri-close-line",
      accessRights: [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_REQUESTOR],
    },
    {
      key: "4",
      label: "All",
      statusIds: [],
      icon: "ri-file-list-line",
      accessRights: [FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_REQUESTOR, FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_APPROVER],
    },
  ];

  return (
    <TransactionPage
      title="Journal Entry Vouchers"
      moduleName="Journal Entry Voucher"
      useGetQuery={isViewerOnly ? useGetListJournalEntryVouchersForViewersQuery : useGetJournalEntryVouchersQuery}
      getColumns={getJournalEntryVoucherColumns}
      columnKey="journalEntryVoucherId"
      codeField="referenceNo"
      breadCrumbs={[
        { title: "FMS", url: "/fms/dashboard" },
      ]}
      modalRegistry={ModalRegistry}
      handlers={handlers}
      state={state}
      customFunction={customFunction}
      requestorAccessRights={[FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_JOURNALENTRYVOUCHERS_REQUESTOR]}
      isShowTabs={isViewerOnly ? false : true}
      tabs={tabs}
    />
  );
};

export default JournalEntryVoucher;
