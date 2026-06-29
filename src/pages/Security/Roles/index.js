import DynamicResourcePage from "@/components/Common/DynamicResourcePage";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";

import { getRolesColumns } from "./Components/Columns";
import { useRolesHandlers } from "./Components/Handlers";
import { rolesModalRegistry } from "./Components/ModalRegistry";

import { useDeleteRolesMutation, useExportRolesMutation, useGetRolesQuery } from "@/api/Endpoints/Core/Security/Roles";

const Roles = () => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();

  const [deleteMutation] = useDeleteRolesMutation();
  const [exportMutation] = useExportRolesMutation();

  const handlers = useRolesHandlers({
    customFunction,
    deleteMutation,
    exportMutation,
    notification,
    moduleName: "Role",
    columnKey: "roleId",
  });

  return (
    <DynamicResourcePage
      title="Roles"
      moduleName="Role"
      useGetQuery={useGetRolesQuery}
      getColumns={getRolesColumns}
      columnKey="roleId"
      codeField="roleName"
      breadCrumbs={[{ title: "Security", url: "#" }]}
      modalRegistry={rolesModalRegistry}
      handlers={handlers}
      state={state}
      customFunction={customFunction}
      accessRights={CORE_ACCESS_RIGHTS.CORE_SECURITY_ROLES}
    />
  );
};

export default Roles;
