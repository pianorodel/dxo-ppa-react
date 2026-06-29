import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'PAYMENTMODES';

export const paymentmodesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/paymentmodes`,
    resource: "PaymentModes",
    idKey: "paymentModeId",
    tagTypes: ["FMS", "PaymentModes"],
    lookupMap: ({ paymentModeId, paymentModeName }) => ({
        value: paymentModeId,
        label: paymentModeName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.paymentModeId });
        }
        return tags; 
    },
});

export const {
    useGetPaymentModesQuery,
    useFindPaymentModesQuery,
    useLookUpPaymentModesMutation,
    useDeletePaymentModesMutation,
    useSavePaymentModesMutation,
    useExportPaymentModesMutation,
} = paymentmodesAPI;
