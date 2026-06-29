import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'BANKS';

export const banksAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/banks`,
    resource: "Banks",
    idKey: "bankId",
    tagTypes: ["MASTER", "Banks"],
   lookupMap: (item) => ({
    ...item,
    value: item.bankId,
    label: item.bankName,
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
