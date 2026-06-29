import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'SAROS';

export const sarosAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/budget/saro`,
    resource: "SAROs",
    idKey: "saroId",
    tagTypes: ["FMS", "SAROs"],
    lookupMap: ({ saroId, saroNo }) => ({
        value: saroId,
        label: saroNo,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.saroId });
        }
        return tags; 
    },
});

export const {
    useGetSAROsQuery,
    useFindSAROsQuery,
    useLookUpSAROsMutation,
    useDeleteSAROsMutation,
    useSaveSAROsMutation,
    useExportSAROsMutation,
} = sarosAPI;
