import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getBankAccountsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteBankAccountsMutation, useExportBankAccountsMutation, useGetBankAccountsQuery } from "@/api/Endpoints/FMS/StaticData/BankAccounts";

const BankAccounts = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Bank Account"
      useGetQuery={useGetBankAccountsQuery}
      useDeleteMutation={useDeleteBankAccountsMutation}
      useExportMutation={useExportBankAccountsMutation}
      getColumns={getBankAccountsColumns}
      columnKey="bankAccountId"
      codeField="bankAccountName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKACCOUNTS}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_BANKACCOUNTS}
    />
  );
};

export default BankAccounts;
