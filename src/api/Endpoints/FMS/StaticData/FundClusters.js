import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'FUNDCLUSTERS';

export const fundclustersAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/fundclusters`,
    resource: "FundClusters",
    idKey: "fundClusterId",
    tagTypes: ["FMS", "FundClusters"],
    lookupMap: ({ fundClusterId, fundClusterName, uacs, displayName }) => ({
        value: fundClusterId,
        label: fundClusterName,
        uacs: uacs,
        displayName: displayName
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.fundClusterId });
        }
        return tags;
    },
});

export const {
    useGetFundClustersQuery,
    useFindFundClustersQuery,
    useLookUpFundClustersMutation,
    useDeleteFundClustersMutation,
    useSaveFundClustersMutation,
    useExportFundClustersMutation,
} = fundclustersAPI;
