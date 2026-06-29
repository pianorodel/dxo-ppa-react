import { useDeleteBURsMutation, useExportBURsMutation, useGetBURsQuery } from "@/api/Endpoints/FMS/Budget/BURs";
import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";
import { getBURsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

const BURs = () => {
    return (
        <StaticResourcePage
            title="Budget Utilization Requests"
            moduleName="BUR"
            useGetQuery={useGetBURsQuery}
            useDeleteMutation={useDeleteBURsMutation}
            useExportMutation={useExportBURsMutation}
            getColumns={getBURsColumns}
            columnKey="burId"
            codeField="displayName"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_BUDGET_BURS}
            logType={FMS_LOG_TYPES.FMS_BUDGET_BURS}
        />
    );
}

export default BURs;
