import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { CORE_LOG_TYPES } from "@/constants/LogTypes";

import { getProvincesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteProvincesMutation, useExportProvincesMutation, useGetProvincesQuery } from "@/api/Endpoints/Master/StaticData/Provinces";

const Provinces = () => {
    return (
        <StaticResourcePage
            title="Provinces"
            moduleName="Province"
            useGetQuery={useGetProvincesQuery}
            useDeleteMutation={useDeleteProvincesMutation}
            useExportMutation={useExportProvincesMutation}
            getColumns={getProvincesColumns}
            columnKey="provinceId"
            codeField="provinceName"
            breadCrumbs={[
                { title: "Core", url: "/core/dashboard" },
                { title: "Settings", url: "/core/staticdata/" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={CORE_ACCESS_RIGHTS.CORE_STATICDATA_PROVINCES}
            logType={CORE_LOG_TYPES.CORE_STATICDATA_PROVINCES}
        />
    );
}

export default Provinces;
