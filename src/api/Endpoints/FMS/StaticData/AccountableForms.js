import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'ACCOUNTABLEFORMS';

export const accountableformsAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/accountableforms`,
    resource: "AccountableForms",
    idKey: "accountableFormId",
    tagTypes: ["FMS", "AccountableForms"],
    lookupMap: ({ accountableFormId, accountableFormName }) => ({
        value: accountableFormId,
        label: accountableFormName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.accountableFormId });
        }
        return tags; 
    },
});

export const {
    useGetAccountableFormsQuery,
    useFindAccountableFormsQuery,
    useLookUpAccountableFormsMutation,
    useDeleteAccountableFormsMutation,
    useSaveAccountableFormsMutation,
    useExportAccountableFormsMutation,
} = accountableformsAPI;
