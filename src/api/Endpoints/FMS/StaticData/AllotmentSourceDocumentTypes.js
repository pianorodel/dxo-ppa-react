import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'ALLOTMENTSOURCEDOCUMENTTYPES';

export const allotmentsourcedocumenttypesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/allotmentsourcedocumenttypes`,
    resource: "AllotmentSourceDocumentTypes",
    idKey: "allotmentSourceDocumentTypeId",
    tagTypes: ["FMS", "AllotmentSourceDocumentTypes"],
    lookupMap: ({ allotmentSourceDocumentTypeId, name }) => ({
        value: allotmentSourceDocumentTypeId,
        label: name,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.allotmentSourceDocumentTypeId });
        }
        return tags; 
    },
});

export const {
    useGetAllotmentSourceDocumentTypesQuery,
    useFindAllotmentSourceDocumentTypesQuery,
    useLookUpAllotmentSourceDocumentTypesMutation,
    useDeleteAllotmentSourceDocumentTypesMutation,
    useSaveAllotmentSourceDocumentTypesMutation,
    useExportAllotmentSourceDocumentTypesMutation,
} = allotmentsourcedocumenttypesAPI;
