import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { CORE_LOG_TYPES } from "@/constants/LogTypes";

import { getCitiesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteCitiesMutation, useExportCitiesMutation, useGetCitiesQuery } from "@/api/Endpoints/Master/StaticData/Cities";

const Cities = () => {
    return (
        <StaticResourcePage
            title="Cities"
            moduleName="City"
            useGetQuery={useGetCitiesQuery}
            useDeleteMutation={useDeleteCitiesMutation}
            useExportMutation={useExportCitiesMutation}
            getColumns={getCitiesColumns}
            columnKey="cityId"
            codeField="cityName"
            breadCrumbs={[
                { title: "Core", url: "/core/dashboard" },
                { title: "Settings", url: "/core/settings/" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={CORE_ACCESS_RIGHTS.CORE_STATICDATA_CITIES}
            logType={CORE_LOG_TYPES.CORE_STATICDATA_CITIES}
        />
    );
}

export default Cities;
