import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'BANKBRANCHES';

export const bankbranchesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/banks/branches`,
    resource: "BankBranches",
    idKey: "branchId",
    tagTypes: ["FMS", "BankBranches"],
    lookupMap: ({ branchId, bankId, bankBranchName }) => ({
        value: branchId,
        label: bankBranchName,
        bankId: bankId,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.branchId });
        }
        return tags;
    },
});

export const {
    useGetBankBranchesQuery,
    useFindBankBranchesQuery,
    useLookUpBankBranchesMutation,
    useDeleteBankBranchesMutation,
    useSaveBankBranchesMutation,
    useExportBankBranchesMutation,
} = bankbranchesAPI;
