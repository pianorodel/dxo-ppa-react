import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'BANKACCOUNTS';

export const bankaccountsAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/bankaccounts`,
    resource: "BankAccounts",
    idKey: "bankAccountId",
    tagTypes: ["FMS", "BankAccounts"],
    lookupMap: ({ bankAccountId, bankAccountName }) => ({
        value: bankAccountId,
        label: bankAccountName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.bankAccountId });
        }
        return tags; 
    },
});

export const {
    useGetBankAccountsQuery,
    useFindBankAccountsQuery,
    useLookUpBankAccountsMutation,
    useDeleteBankAccountsMutation,
    useSaveBankAccountsMutation,
    useExportBankAccountsMutation,
} = bankaccountsAPI;
