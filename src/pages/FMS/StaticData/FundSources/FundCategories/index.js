import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getFundCategoriesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteFundCategoriesMutation,
  useExportFundCategoriesMutation,
  useGetFundCategoriesQuery,
} from "@/api/Endpoints/FMS/StaticData/FundCategories";
 
const FundCategories = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Fund Category"
      useGetQuery={useGetFundCategoriesQuery}
      useDeleteMutation={useDeleteFundCategoriesMutation}
      useExportMutation={useExportFundCategoriesMutation}
      getColumns={getFundCategoriesColumns}
      columnKey="fundCategoryId"
      codeField="fundCategoryName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_FUNDCATEGORIES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_FUNDCATEGORIES}
    />
  );
};

export default FundCategories;
