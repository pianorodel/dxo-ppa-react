import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'BANKS';

export const banksAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/banks`,
    resource: "Banks",
    idKey: "bankId",
    tagTypes: ["FMS", "Banks"],
    lookupMap: ({ bankId, bankName }) => ({
        value: bankId,
        label: bankName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.bankId });
        }
        return tags; 
    },
});

export const {
    useGetBanksQuery,
    useFindBanksQuery,
    useLookUpBanksMutation,
    useDeleteBanksMutation,
    useSaveBanksMutation,
    useExportBanksMutation,
} = banksAPI;
