import { useDeleteSAROsMutation, useExportSAROsMutation, useGetSAROsQuery } from "@/api/Endpoints/FMS/Budget/SAROs";
import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";
import { getSAROsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

const SAROs = () => {
    return (
        <StaticResourcePage
            title="Special Allotment Release Order"
            moduleName="SARO"
            useGetQuery={useGetSAROsQuery}
            useDeleteMutation={useDeleteSAROsMutation}
            useExportMutation={useExportSAROsMutation}
            getColumns={getSAROsColumns}
            columnKey="saroId"
            codeField="saroNo"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_BUDGET_SAROS}
            logType={FMS_LOG_TYPES.FMS_BUDGET_SAROS}
        />
    );
}

export default SAROs;
