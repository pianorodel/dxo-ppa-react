import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getFinancingSourcesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteFinancingSourcesMutation,
  useExportFinancingSourcesMutation,
  useGetFinancingSourcesQuery,
} from "@/api/Endpoints/FMS/StaticData/FinancingSources";

const FinancingSources = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Financing Source"
      useGetQuery={useGetFinancingSourcesQuery}
      useDeleteMutation={useDeleteFinancingSourcesMutation}
      useExportMutation={useExportFinancingSourcesMutation}
      getColumns={getFinancingSourcesColumns}
      columnKey="financingSourceId"
      codeField="financingSourceName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_FINANCINGSOURCES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_FINANCINGSOURCES}
    />
  );
};

export default FinancingSources;
