import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getDocumentTypesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteDocumentTypesMutation,
  useExportDocumentTypesMutation,
  useGetDocumentTypesQuery,
} from "@/api/Endpoints/Master/StaticData/DocumentTypes";

const DocumentTypes = () => {
  return (
    <StaticResourcePage
      title="Document Types"
      moduleName="Document Type"
      useGetQuery={useGetDocumentTypesQuery}
      useDeleteMutation={useDeleteDocumentTypesMutation}
      useExportMutation={useExportDocumentTypesMutation}
      getColumns={getDocumentTypesColumns}
      columnKey="documentTypeId"
      codeField="documentTypeName"
      breadCrumbs={[
        { title: "FMS", url: "/fms/dashboard" },
        { title: "Settings", url: "/fms/settings/" },
      ]}
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_DOCUMENTTYPES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_DOCUMENTTYPES}
    />
  );
};

export default DocumentTypes;
