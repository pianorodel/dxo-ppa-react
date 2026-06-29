import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'SUBSIDIARYLEDGERS';

export const subsidiaryledgersAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/subsidiaryledgers`,
    resource: "SubsidiaryLedgers",
    idKey: "subsidiaryLedgerId",
    tagTypes: ["FMS", "SubsidiaryLedgers"],
    lookupMap: ({ subsidiaryLedgerId, accountTitle }) => ({
        value: subsidiaryLedgerId,
        label: accountTitle,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.subsidiaryLedgerId });
        }
        return tags; 
    },
});

export const {
    useGetSubsidiaryLedgersQuery,
    useFindSubsidiaryLedgersQuery,
    useLookUpSubsidiaryLedgersMutation,
    useDeleteSubsidiaryLedgersMutation,
    useSaveSubsidiaryLedgersMutation,
    useExportSubsidiaryLedgersMutation,
} = subsidiaryledgersAPI;
