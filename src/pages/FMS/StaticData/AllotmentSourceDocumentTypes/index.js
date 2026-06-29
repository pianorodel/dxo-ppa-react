import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getAllotmentSourceDocumentTypesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteAllotmentSourceDocumentTypesMutation,
  useExportAllotmentSourceDocumentTypesMutation,
  useGetAllotmentSourceDocumentTypesQuery,
} from "@/api/Endpoints/FMS/StaticData/AllotmentSourceDocumentTypes";

const AllotmentSourceDocumentTypes = () => {
  return (
    <StaticResourcePage
      title="Allotment Source Document Types"
      moduleName="Allotment Source Document Type"
      useGetQuery={useGetAllotmentSourceDocumentTypesQuery}
      useDeleteMutation={useDeleteAllotmentSourceDocumentTypesMutation}
      useExportMutation={useExportAllotmentSourceDocumentTypesMutation}
      getColumns={getAllotmentSourceDocumentTypesColumns}
      columnKey="allotmentSourceDocumentTypeId"
      codeField="name"
      breadCrumbs={[
        { title: "FMS", url: "/fms/dashboard" },
        { title: "Settings", url: "/fms/settings/" },
      ]}
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_ALLOTMENTSOURCEDOCUMENTTYPES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_ALLOTMENTSOURCEDOCUMENTTYPES}
    />
  );
};

export default AllotmentSourceDocumentTypes;
