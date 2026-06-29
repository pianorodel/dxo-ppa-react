import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getBanksColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteBanksMutation, useExportBanksMutation, useGetBanksQuery } from "@/api/Endpoints/FMS/StaticData/Banks";

const Banks = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Bank"
      useGetQuery={useGetBanksQuery}
      useDeleteMutation={useDeleteBanksMutation}
      useExportMutation={useExportBanksMutation}
      getColumns={getBanksColumns}
      columnKey="bankId"
      codeField="bankName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKS}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_BANKS}
    />
  );
};

export default Banks;
