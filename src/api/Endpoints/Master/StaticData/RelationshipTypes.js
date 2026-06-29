import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'RELATIONSHIPTYPES';

export const relationshiptypesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/relationshiptypes`,
    resource: "RelationshipTypes",
    idKey: "relationshipTypeId",
    tagTypes: ["HRIS", "RelationshipTypes"],
    lookupMap: ({ relationshipTypeId, relationshipTypeName }) => ({
        value: relationshipTypeId,
        label: relationshipTypeName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.relationshipTypeId });
        }
        return tags; 
    },
});

export const {
    useGetRelationshipTypesQuery,
    useFindRelationshipTypesQuery,
    useLookUpRelationshipTypesMutation,
    useDeleteRelationshipTypesMutation,
    useSaveRelationshipTypesMutation,
    useExportRelationshipTypesMutation,
} = relationshiptypesAPI;
