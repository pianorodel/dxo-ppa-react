import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getFundSubCategoriesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteFundSubCategoriesMutation, useExportFundSubCategoriesMutation, useGetFundSubCategoriesQuery } from "@/api/Endpoints/FMS/StaticData/FundSubCategories";

const FundSubCategories = () => {
    return (
        <TabbedStaticResourcePage
            moduleName="Fund Sub Category"
            useGetQuery={useGetFundSubCategoriesQuery}
            useDeleteMutation={useDeleteFundSubCategoriesMutation}
            useExportMutation={useExportFundSubCategoriesMutation}
            getColumns={getFundSubCategoriesColumns}
            columnKey="fundSubCategoryId"
            codeField="fundSubCategoryName"
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_FUNDSUBCATEGORIES}
            logType={FMS_LOG_TYPES.FMS_STATICDATA_FUNDSUBCATEGORIES}
        />
    );
}

export default FundSubCategories;
