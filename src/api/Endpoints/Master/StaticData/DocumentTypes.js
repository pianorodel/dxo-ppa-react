import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'DOCUMENTTYPES';

export const documenttypesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/documenttypes`,
    resource: "DocumentTypes",
    idKey: "documentTypeId",
    tagTypes: ["MASTER", "DocumentTypes"],
    lookupMap: ({ documentTypeId, documentTypeName }) => ({
        value: documentTypeId,
        label: documentTypeName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.documentTypeId });
        }
        return tags; 
    },
});

export const {
    useGetDocumentTypesQuery,
    useFindDocumentTypesQuery,
    useLookUpDocumentTypesMutation,
    useDeleteDocumentTypesMutation,
    useSaveDocumentTypesMutation,
    useExportDocumentTypesMutation,
} = documenttypesAPI;
