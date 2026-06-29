import { useDeleteGAAsMutation, useExportGAAsMutation, useGetGAAsQuery } from "@/api/Endpoints/FMS/Budget/GAAs";
import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";
import { getGAAsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

const GAAs = () => {
    return (
        <StaticResourcePage
            title="General Appropriations Acts"
            moduleName="GAA"
            useGetQuery={useGetGAAsQuery}
            useDeleteMutation={useDeleteGAAsMutation}
            useExportMutation={useExportGAAsMutation}
            getColumns={getGAAsColumns}
            columnKey="gaaId"
            codeField="displayName"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_BUDGET_GAAS}
            logType={FMS_LOG_TYPES.FMS_BUDGET_GAAS}
        />
    );
}

export default GAAs;
