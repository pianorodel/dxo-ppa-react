import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'FINANCINGSOURCES';

export const financingsourcesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/financingsources`,
    resource: "FinancingSources",
    idKey: "financingSourceId",
    tagTypes: ["FMS", "FinancingSources"],
    lookupMap: ({ financingSourceId, financingSourceName, displayName }) => ({
        value: financingSourceId,
        label: financingSourceName,
        displayName: displayName
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.financingSourceId });
        }
        return tags; 
    },
});

export const {
    useGetFinancingSourcesQuery,
    useFindFinancingSourcesQuery,
    useLookUpFinancingSourcesMutation,
    useDeleteFinancingSourcesMutation,
    useSaveFinancingSourcesMutation,
    useExportFinancingSourcesMutation,
} = financingsourcesAPI;
