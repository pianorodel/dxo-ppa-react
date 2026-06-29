import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'ASSETS';

export const assetsAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/asset/assets`,
    resource: "Assets",
    idKey: "assetId",
    tagTypes: ["FMS", "Assets"],
    lookupMap: ({ assetId, assetName }) => ({
        value: assetId,
        label: assetName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.assetId });
        }
        return tags; 
    },
});

export const {
    useGetAssetsQuery,
    useFindAssetsQuery,
    useLookUpAssetsMutation,
    useDeleteAssetsMutation,
    useSaveAssetsMutation,
    useExportAssetsMutation,
} = assetsAPI;
