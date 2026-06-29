import TabbedStaticResourcePage from "@/components/Common/TabbedStaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getAuthorizationCodesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteAuthorizationCodesMutation,
  useExportAuthorizationCodesMutation,
  useGetAuthorizationCodesQuery,
} from "@/api/Endpoints/FMS/StaticData/AuthorizationCodes";

const AuthorizationCodes = () => {
  return (
    <TabbedStaticResourcePage
      moduleName="Authorization Code"
      useGetQuery={useGetAuthorizationCodesQuery}
      useDeleteMutation={useDeleteAuthorizationCodesMutation}
      useExportMutation={useExportAuthorizationCodesMutation}
      getColumns={getAuthorizationCodesColumns}
      columnKey="authorizationCodeId"
      codeField="authorizationCodeName"
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_AUTHORIZATIONCODES}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_AUTHORIZATIONCODES}
    />
  );
};

export default AuthorizationCodes;
