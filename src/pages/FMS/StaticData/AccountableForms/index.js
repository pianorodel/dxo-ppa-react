import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getAccountableFormsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteAccountableFormsMutation,
  useExportAccountableFormsMutation,
  useGetAccountableFormsQuery,
} from "@/api/Endpoints/FMS/StaticData/AccountableForms";

const AccountableForms = () => {
  return (
    <StaticResourcePage
      title="Accountable Forms"
      moduleName="Accountable Form"
      useGetQuery={useGetAccountableFormsQuery}
      useDeleteMutation={useDeleteAccountableFormsMutation}
      useExportMutation={useExportAccountableFormsMutation}
      getColumns={getAccountableFormsColumns}
      columnKey="accountableFormId"
      codeField="accountableFormName"
      breadCrumbs={[
        { title: "FMS", url: "/fms/dashboard" },
        { title: "Settings", url: "/fms/settings/" },
      ]}
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_ACCOUNTABLEFORMS}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_ACCOUNTABLEFORMS}
    />
  );
};

export default AccountableForms;
