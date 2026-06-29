import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getSubObjectCodesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteSubObjectCodesMutation, useExportSubObjectCodesMutation, useGetSubObjectCodesQuery } from "@/api/Endpoints/FMS/StaticData/SubObjectCodes";

const SubObjectCodes = () => {
    return (
        <TabbedStaticResourcePage
            moduleName="Sub Object Code"
            useGetQuery={useGetSubObjectCodesQuery}
            useDeleteMutation={useDeleteSubObjectCodesMutation}
            useExportMutation={useExportSubObjectCodesMutation}
            getColumns={getSubObjectCodesColumns}
            columnKey="subObjectCodeId"
            codeField="subObjectCodeName"
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_SUBOBJECTCODES}
            logType={FMS_LOG_TYPES.FMS_STATICDATA_SUBOBJECTCODES}
            isTableOnly
        />
    );
}

export default SubObjectCodes;
