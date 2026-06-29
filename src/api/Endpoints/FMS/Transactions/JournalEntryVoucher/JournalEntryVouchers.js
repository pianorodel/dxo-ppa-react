import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/journalEntryVouchers';

export const journalEntryVouchersAPI = createStaticResourceAPI({
  baseURL: baseURL,
  resource: "JournalEntryVouchers",
  tagTypes: ["JournalEntryVouchers"],
  idKey: "journalEntryVoucherId",
  lookupMap: ({ journalEntryVoucherId, referenceNo }) => ({
    value: journalEntryVoucherId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListJournalEntryVouchersForViewers: query(`${baseURL}/listForViewer`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) => {
        if (!result?.success || !Array.isArray(result.returnData)) {
          return [{ type: resource, id: "LIST" }];
        }

        return [
          ...result.returnData.map((item) => ({
            type: resource,
            id: item[idKey],
          })),
          { type: resource, id: "LIST" },
        ];
      }
    }),
  }),
  customMutations: (mutation, mutationOptions) => ({
    submitJournalEntryVouchers: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnJournalEntryVouchers: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveJournalEntryVouchers: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectJournalEntryVouchers: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelJournalEntryVouchers: mutation(`${baseURL}/cancel`, mutationOptions("save")),
  }),
});

export const {
  useGetJournalEntryVouchersQuery,
  useGetListJournalEntryVouchersForViewersQuery,
  useExportJournalEntryVouchersMutation,
  useFindJournalEntryVouchersQuery,
  useLookUpJournalEntryVouchersMutation,
  useSaveJournalEntryVouchersMutation,
  useSubmitJournalEntryVouchersMutation,
  useReturnJournalEntryVouchersMutation,
  useApproveJournalEntryVouchersMutation,
  useRejectJournalEntryVouchersMutation,
  useCancelJournalEntryVouchersMutation,
  useDeleteJournalEntryVouchersMutation
} = journalEntryVouchersAPI;
