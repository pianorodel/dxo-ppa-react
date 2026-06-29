import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'AUTHORIZATIONCODES';

export const authorizationcodesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/authorizationcodes`,
    resource: "AuthorizationCodes",
    idKey: "authorizationCodeId",
    tagTypes: ["FMS", "AuthorizationCodes"],
    lookupMap: (data) => ({
        ...data,
        value: data?.authorizationCodeId,
        label: data?.authorizationCodeName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.authorizationCodeId });
        }
        return tags; 
    },
});

export const {
    useGetAuthorizationCodesQuery,
    useFindAuthorizationCodesQuery,
    useLookUpAuthorizationCodesMutation,
    useDeleteAuthorizationCodesMutation,
    useSaveAuthorizationCodesMutation,
    useExportAuthorizationCodesMutation,
} = authorizationcodesAPI;
