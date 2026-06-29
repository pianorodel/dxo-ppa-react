import { useState } from "react";

import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { StatusChip } from "@/components/Common/StatusChip";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { CORE_LOG_TYPES } from "@/constants/LogTypes";
import { assertApiSuccess } from "@/helpers/api_helper";

import { getUsersColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useCreateEmployeeUsersMutation,
  useDeleteUsersMutation,
  useExportUsersMutation,
  useGetUsersQuery,
  useLinkEmployeeUsersMutation,
} from "@/api/Endpoints/Core/Security/Users";

const Users = () => {
  const [presenceFilter, setPresenceFilter] = useState("");
  const [createEmployee] = useCreateEmployeeUsersMutation();
  const [linkEmployee] = useLinkEmployeeUsersMutation();

  const presenceToolbar = (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {[
        { key: "", label: "All", color: "info" },
        { key: "Online", label: "Online", color: "success" },
        { key: "Idle", label: "Idle", color: "warning" },
        { key: "Offline", label: "Offline", color: "danger" },
      ].map(({ key, label, color }) => {
        const isActive = presenceFilter === key;
        return (
          <StatusChip key={key} label={label} isActive={isActive} color={color} onClick={() => setPresenceFilter(key)} />
        );
      })}
    </div>
  );

  const handleConfirmClick = async (data, state, { refetch, notification, updateToggle }) => {
    try {
      const res = await createEmployee({ userId: data.userId }).unwrap();
      assertApiSuccess(res);
      notification({ type: "success", title: "User", message: "Employee record created successfully." });
      refetch();
    } catch (error) {
      notification({ type: "error", title: "User", message: error.message });
    } finally {
      updateToggle("toggleCreateEmployee");
    }
  };

  const handleLinkEmployeeConfirm = async (data, state, { refetch, notification, updateToggle }, selectedEmployee) => {
    try {
      const res = await linkEmployee({ userId: data.userId, employeeId: selectedEmployee.employeeId }).unwrap();
      assertApiSuccess(res);
      notification({ type: "success", title: "User", message: "Employee record linked successfully." });
      refetch();
    } catch (error) {
      notification({ type: "error", title: "User", message: error.message });
    } finally {
      updateToggle("toggleLinkEmployee");
    }
  };

  return (
    <StaticResourcePage
      title="Users"
      moduleName="User"
      useGetQuery={useGetUsersQuery}
      useDeleteMutation={useDeleteUsersMutation}
      useExportMutation={useExportUsersMutation}
      getColumns={getUsersColumns}
      columnKey="userId"
      codeField="fullName"
      logType={CORE_LOG_TYPES.SECURITY_USERS}
      breadCrumbs={[{ title: "Security", url: "#" }]}
      SaveModalComponent={SaveModal}
      accessRights={CORE_ACCESS_RIGHTS.CORE_SECURITY_USERS}
      customListPayload={{ onlineStatus: presenceFilter === "all" ? undefined : presenceFilter }}
      customToolbarsEnd={
        <div className="col-auto p-0 d-flex align-items-center ms-2">
          <div style={{ width: "0.5px", height: 20, background: "lightgray", marginRight: 12 }} />
          {presenceToolbar}
        </div>
      }
      customModals={[
      ]}
    />
  );
};

export default Users;
