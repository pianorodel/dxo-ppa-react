import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getPrepaidTypesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeletePrepaidTypesMutation, useExportPrepaidTypesMutation, useGetPrepaidTypesQuery } from "@/api/Endpoints/FMS/StaticData/PrepaidTypes";

const PrepaidTypes = () => {
    return (
        <StaticResourcePage
            title="Prepaid Types"
            moduleName="Prepaid Type"
            useGetQuery={useGetPrepaidTypesQuery}
            useDeleteMutation={useDeletePrepaidTypesMutation}
            useExportMutation={useExportPrepaidTypesMutation}
            getColumns={getPrepaidTypesColumns}
            columnKey="prepaidTypeId"
            codeField="prepaidTypeName"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
                { title: "Settings", url: "/fms/settings" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_PREPAIDTYPES}
            logType={FMS_LOG_TYPES.FMS_STATICDATA_PREPAIDTYPES}
        />
    );
}

export default PrepaidTypes;
