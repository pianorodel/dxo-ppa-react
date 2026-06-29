import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'REGIONS';

export const regionsAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/regions`,
    resource: "Regions",
    idKey: "regionId",
    tagTypes: ["CORE", "Regions"],
    lookupMap: ({ regionId, regionName }) => ({
        value: regionId,
        label: regionName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.regionId });
        }
        return tags; 
    },
});

export const {
    useGetRegionsQuery,
    useFindRegionsQuery,
    useLookUpRegionsMutation,
    useDeleteRegionsMutation,
    useSaveRegionsMutation,
    useExportRegionsMutation,
} = regionsAPI;
