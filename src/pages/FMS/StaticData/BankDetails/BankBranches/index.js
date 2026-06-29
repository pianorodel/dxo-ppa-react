import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getBankBranchesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteBankBranchesMutation, useExportBankBranchesMutation, useGetBankBranchesQuery } from "@/api/Endpoints/FMS/StaticData/BankBranches";

const BankBranches = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Bank Branch"
      useGetQuery={useGetBankBranchesQuery}
      useDeleteMutation={useDeleteBankBranchesMutation}
      useExportMutation={useExportBankBranchesMutation}
      getColumns={getBankBranchesColumns}
      columnKey="branchId"
      codeField="branchName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKBRANCHES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_BANKBRANCHES}
    />
  );
};

export default BankBranches;
