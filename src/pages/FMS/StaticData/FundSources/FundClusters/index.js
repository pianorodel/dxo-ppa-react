import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getFundClustersColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteFundClustersMutation, useExportFundClustersMutation, useGetFundClustersQuery } from "@/api/Endpoints/FMS/StaticData/FundClusters";
 
const FundClusters = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Fund Cluster"
      useGetQuery={useGetFundClustersQuery}
      useDeleteMutation={useDeleteFundClustersMutation}
      useExportMutation={useExportFundClustersMutation}
      getColumns={getFundClustersColumns}
      columnKey="fundClusterId"
      codeField="fundClusterName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_FUNDCLUSTERS}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_FUNDCLUSTERS}
    />
  );
};

export default FundClusters;
