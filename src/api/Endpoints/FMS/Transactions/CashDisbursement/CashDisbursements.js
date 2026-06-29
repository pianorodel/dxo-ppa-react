import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/cashDisbursements';

export const cashDisbursementsAPI = createStaticResourceAPI({
  baseURL: baseURL,
  resource: "CashDisbursements",
  tagTypes: ["CashDisbursements"],
  idKey: "cashDisbursementId",
  lookupMap: ({ cashDisbursementId, referenceNo }) => ({
    value: cashDisbursementId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListCashDisbursementsForViewers: query(`${baseURL}/listForViewer`, {
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
    submitCashDisbursements: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnCashDisbursements: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveCashDisbursements: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectCashDisbursements: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelCashDisbursements: mutation(`${baseURL}/cancel`, mutationOptions("save")),
  }),
});

export const {
  useGetCashDisbursementsQuery,
  useGetListCashDisbursementsForViewersQuery,
  useExportCashDisbursementsMutation,
  useFindCashDisbursementsQuery,
  useLookUpCashDisbursementsMutation,
  useSaveCashDisbursementsMutation,
  useSubmitCashDisbursementsMutation,
  useReturnCashDisbursementsMutation,
  useApproveCashDisbursementsMutation,
  useRejectCashDisbursementsMutation,
  useCancelCashDisbursementsMutation,
  useDeleteCashDisbursementsMutation
} = cashDisbursementsAPI;
