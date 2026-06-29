import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

export const rolesAPI = createStaticResourceAPI({
  baseURL: `${process.env.REACT_APP_CORE_API}/security/roles`,
  resource: "Roles",
  idKey: "roleId",
  tagTypes: ["Security", "Roles"],
  lookupMap: ({ roleId, roleName }) => ({
    value: roleId,
    label: roleName,
  }),
});

export const {
  useGetRolesQuery,
  useFindRolesQuery,
  useLookUpRolesMutation,
  useDeleteRolesMutation,
  useSaveRolesMutation,
  useExportRolesMutation,
} = rolesAPI;

