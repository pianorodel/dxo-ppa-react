import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'GAAS';

export const gaasAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/budget/gaa`,
    resource: "GAAs",
    idKey: "gaaId",
    tagTypes: ["FMS", "GAAs"],
    lookupMap: ({ gaaId, displayName }) => ({
        value: gaaId,
        label: displayName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.gaaId });
        }
        return tags; 
    },
});

export const {
    useGetGAAsQuery,
    useFindGAAsQuery,
    useLookUpGAAsMutation,
    useDeleteGAAsMutation,
    useSaveGAAsMutation,
    useExportGAAsMutation,
} = gaasAPI;
