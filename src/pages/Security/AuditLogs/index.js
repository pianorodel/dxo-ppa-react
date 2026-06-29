import { useState } from "react";

import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { useSignalRListener } from "@/components/Hooks/useSignalRListener";
import { SIGNALR_MESSAGE_TYPES } from "@/constants/signalrMessageTypes";

import UserDetails from "../UserDetails";
import AdvanceFilter from "./Components/AdvanceFilter";
import { getSystemLogsColumns } from "./Components/Columns";

import { useExportSystemLogsMutation, useGetListSystemLogsQuery, useGetSystemLogsQuery } from "@/api/Endpoints/Core/App/SystemLogs";

const SystemLogs = () => {
  const [key, setKey] = useState(0);

  useSignalRListener({
    type: SIGNALR_MESSAGE_TYPES.CORE_SECURITY_AUDITLOGS,
    handler: () => setKey((key) => key + 1),
  });

  return (
    <StaticResourcePage
      key={key}
      title="System Audit Logs"
      moduleName="System Audit Log"
      useGetQuery={useGetListSystemLogsQuery}
      useExportMutation={useExportSystemLogsMutation}
      getColumns={getSystemLogsColumns}
      AdvanceFilterComponent={AdvanceFilter}
      columnKey="logId"
      codeField="system"
      breadCrumbs={[{ title: "Security", url: "#" }]}
      isReadOnly
      customModals={[
        {
          key: "viewDetails",
          component: UserDetails,
          toggleKey: "toggleViewDetails",
        },
      ]}
    />
  );
};

export default SystemLogs;
