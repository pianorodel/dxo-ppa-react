import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

export const usersAPI = createStaticResourceAPI({
  baseURL: `${process.env.REACT_APP_CORE_API}/security/users`,
  resource: "Users",
  idKey: "userId",
  tagTypes: ["Security", "Users"],
  lookupMap: ({ userId, fullName }) => ({
    value: userId,
    label: fullName,
  }),
  customMutations: (mutation, mutationOptions) => ({
    saveWithRolesUsers: mutation(`${process.env.REACT_APP_CORE_API}/security/users/saveWithRoles`, mutationOptions("save")),
    updateAvatar: mutation(`${process.env.REACT_APP_CORE_API}/security/users/updateAvatar`, mutationOptions("save")),
    changePassword: mutation(`${process.env.REACT_APP_CORE_API}/security/users/changePassword`),
    resetPassword: mutation(`${process.env.REACT_APP_CORE_API}/security/users/reset-password`),
    validatePasswordToken: mutation(`${process.env.REACT_APP_CORE_API}/security/users/validate-password-token`),
    changePasswordWithToken: mutation(`${process.env.REACT_APP_CORE_API}/security/users/changePassword-withtoken`),
    createEmployeeUsers: mutation(`${process.env.REACT_APP_CORE_API}/security/users/create-employee`, mutationOptions("save")),
    linkEmployeeUsers: mutation(`${process.env.REACT_APP_CORE_API}/security/users/link-employee`, mutationOptions("save")),
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getAccessUsers: query(`${baseURL}/access/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [
              ...result.returnData?.map((item) => ({
                type: resource,
                id: item[idKey],
              })),
              { type: resource, id: "LIST" },
            ]
          : [{ type: resource, id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useFindUsersQuery,
  useLookUpUsersMutation,
  useDeleteUsersMutation,
  useSaveUsersMutation,
  useExportUsersMutation,
  useSaveWithRolesUsersMutation,
  useUpdateAvatarMutation,
  useGetAccessUsersQuery,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useValidatePasswordTokenMutation,
  useChangePasswordWithTokenMutation,
  useCreateEmployeeUsersMutation,
  useLinkEmployeeUsersMutation,
} = usersAPI;
