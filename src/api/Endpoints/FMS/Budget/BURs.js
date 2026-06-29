import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'BURS';

export const bursAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/budget/bur`,
    resource: "BURs",
    idKey: "burId",
    tagTypes: ["FMS", "BURs"],
    lookupMap: ({ burId, displayName }) => ({
        value: burId,
        label: displayName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.burId });
        }
        return tags; 
    },
});

export const {
    useGetBURsQuery,
    useFindBURsQuery,
    useLookUpBURsMutation,
    useDeleteBURsMutation,
    useSaveBURsMutation,
    useExportBURsMutation,
} = bursAPI;
