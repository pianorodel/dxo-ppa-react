import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'BANKBRANCHES';

export const bankbranchesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/banks/branches`,
    resource: "BankBranches",
    idKey: "branchId",
    tagTypes: ["MASTER", "BankBranches"],
    lookupMap: ({ branchId, branchName }) => ({
        value: branchId,
        label: branchName,
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
