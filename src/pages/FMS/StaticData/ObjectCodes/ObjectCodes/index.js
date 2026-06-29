import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getObjectCodesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteObjectCodesMutation, useExportObjectCodesMutation, useGetObjectCodesQuery } from "@/api/Endpoints/FMS/StaticData/ObjectCodes";

const ObjectCodes = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Object Code"
      useGetQuery={useGetObjectCodesQuery}
      useDeleteMutation={useDeleteObjectCodesMutation}
      useExportMutation={useExportObjectCodesMutation}
      getColumns={getObjectCodesColumns}
      columnKey="objectCodeId"
      codeField="code"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_OBJECTCODES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_OBJECTCODES}
      isTableOnly
    />
  );
};

export default ObjectCodes;
