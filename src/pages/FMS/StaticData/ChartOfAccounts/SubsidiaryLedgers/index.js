import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getSubsidiaryLedgersColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteSubsidiaryLedgersMutation,
  useExportSubsidiaryLedgersMutation,
  useGetSubsidiaryLedgersQuery,
} from "@/api/Endpoints/FMS/StaticData/SubsidiaryLedgers";

const SubsidiaryLedgers = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Subsidiary Ledger"
      useGetQuery={useGetSubsidiaryLedgersQuery}
      useDeleteMutation={useDeleteSubsidiaryLedgersMutation}
      useExportMutation={useExportSubsidiaryLedgersMutation}
      getColumns={getSubsidiaryLedgersColumns}
      columnKey="subsidiaryLedgerId"
      codeField="accountTitle"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_SUBSIDIARYLEDGERS}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_SUBSIDIARYLEDGERS}
    />
  );
};

export default SubsidiaryLedgers;
