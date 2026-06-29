import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'FEETYPES';

export const feetypesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/feetypes`,
    resource: "FeeTypes",
    idKey: "feeTypeId",
    tagTypes: ["FMS", "FeeTypes"],
    lookupMap: ({ feeTypeId, feeTypeName }) => ({
        value: feeTypeId,
        label: feeTypeName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.feeTypeId });
        }
        return tags; 
    },
});

export const {
    useGetFeeTypesQuery,
    useFindFeeTypesQuery,
    useLookUpFeeTypesMutation,
    useDeleteFeeTypesMutation,
    useSaveFeeTypesMutation,
    useExportFeeTypesMutation,
} = feetypesAPI;
