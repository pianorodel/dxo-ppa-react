import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { CORE_LOG_TYPES } from "@/constants/LogTypes";

import { getRegionsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteRegionsMutation, useExportRegionsMutation, useGetRegionsQuery } from "@/api/Endpoints/Master/StaticData/Regions";

const Regions = () => {
    return (
        <StaticResourcePage
            title="Regions"
            moduleName="Region"
            useGetQuery={useGetRegionsQuery}
            useDeleteMutation={useDeleteRegionsMutation}
            useExportMutation={useExportRegionsMutation}
            getColumns={getRegionsColumns}
            columnKey="regionId"
            codeField="regionName"
            breadCrumbs={[
                { title: "Core", url: "/core/dashboard" },
                { title: "Settings", url: "/core/staticdata/" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={CORE_ACCESS_RIGHTS.CORE_STATICDATA_REGIONS}
            logType={CORE_LOG_TYPES.CORE_STATICDATA_REGIONS}
        />
    );
}

export default Regions;
