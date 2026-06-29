import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getFeeTypesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteFeeTypesMutation, useExportFeeTypesMutation, useGetFeeTypesQuery } from "@/api/Endpoints/FMS/StaticData/FeeTypes";

const FeeTypes = () => {
    return (
        <StaticResourcePage
            title="Fee Types"
            moduleName="Fee Type"
            useGetQuery={useGetFeeTypesQuery}
            useDeleteMutation={useDeleteFeeTypesMutation}
            useExportMutation={useExportFeeTypesMutation}
            getColumns={getFeeTypesColumns}
            columnKey="feeTypeId"
            codeField="feeTypeName"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
                { title: "Settings", url: "/fms/settings" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_FEETYPES}
            logType={FMS_LOG_TYPES.FMS_STATICDATA_FEETYPES}
        />
    );
}

export default FeeTypes;
