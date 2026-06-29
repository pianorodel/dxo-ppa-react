import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const baseURL = process.env.REACT_APP_CORE_API + '/security/roles/permissions';

export const permissionsAPI = createStaticResourceAPI({
    baseURL: baseURL,
    resource: "Permissions",
    tagTypes: ["Permissions"],
    idKey: "permissionTypeId",
    lookupMap: ({ permissionTypeId, permissionTypeName }) => ({
        value: permissionTypeId,
        label: permissionTypeName,
    }),
    customMutations: (mutation, mutationOptions) => ({
        toggleReadPermissions: mutation(`${baseURL}/toggleRead`, mutationOptions("save")),
        toggleWritePermissions: mutation(`${baseURL}/toggleWrite`, mutationOptions("save")),
        toggleDeletePermissions: mutation(`${baseURL}/toggleDelete`, mutationOptions("save")),
        toggleAllPermissions: mutation(`${baseURL}/toggleAll`, mutationOptions("save")),
    }),
});


export const {
    useGetPermissionsQuery,
    useExportPermissionsMutation,
    useToggleReadPermissionsMutation,
    useToggleWritePermissionsMutation,
    useToggleDeletePermissionsMutation,
    useToggleAllPermissionsMutation
} = permissionsAPI;
