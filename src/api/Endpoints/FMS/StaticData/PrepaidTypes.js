import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'PREPAIDTYPES';

export const prepaidtypesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/prepaidtypes`,
    resource: "PrepaidTypes",
    idKey: "prepaidTypeId",
    tagTypes: ["FMS", "PrepaidTypes"],
    lookupMap: ({ prepaidTypeId, prepaidTypeName }) => ({
        value: prepaidTypeId,
        label: prepaidTypeName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.prepaidTypeId });
        }
        return tags; 
    },
});

export const {
    useGetPrepaidTypesQuery,
    useFindPrepaidTypesQuery,
    useLookUpPrepaidTypesMutation,
    useDeletePrepaidTypesMutation,
    useSavePrepaidTypesMutation,
    useExportPrepaidTypesMutation,
} = prepaidtypesAPI;
