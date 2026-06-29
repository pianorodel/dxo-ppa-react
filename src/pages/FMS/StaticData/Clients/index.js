import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import SaveModal from "./Components/SaveModal";
import { getClientsColumns } from "./Components/column";

import { useDeleteClientsMutation, useExportClientsMutation, useGetClientsQuery } from "@/api/Endpoints/FMS/StaticData/Clients";

const Clients = () => {
  return (
    <StaticResourcePage
      title="Clients"
      moduleName="Client"
      useGetQuery={useGetClientsQuery}
      useDeleteMutation={useDeleteClientsMutation}
      useExportMutation={useExportClientsMutation}
      getColumns={getClientsColumns}
      columnKey="clientId"
      codeField="clientName"
      breadCrumbs={[
        { title: "FMS", url: "/fms/dashboard" },
        { title: "Settings", url: "/fms/settings" },
      ]}
      SaveModalComponent={SaveModal}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_CLIENTS}
      logType={FMS_LOG_TYPES.FMS_STATICDATA_CLIENTS}
    />
  );
};

export default Clients;
