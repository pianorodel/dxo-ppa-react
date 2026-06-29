import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/disbursementVouchers';

export const disbursementVouchersAPI = createStaticResourceAPI({
  baseURL: baseURL,
  resource: "DisbursementVouchers",
  tagTypes: ["DisbursementVouchers"],
  idKey: "disbursementVoucherId",
  lookupMap: ({ disbursementVoucherId, referenceNo }) => ({
    value: disbursementVoucherId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListDisbursementVouchersForViewers: query(`${baseURL}/listForViewer`, {
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
    submitDisbursementVouchers: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnDisbursementVouchers: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveDisbursementVouchers: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectDisbursementVouchers: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelDisbursementVouchers: mutation(`${baseURL}/cancel`, mutationOptions("save")),
  }),
});

export const {
  useGetDisbursementVouchersQuery,
  useGetListDisbursementVouchersForViewersQuery,
  useExportDisbursementVouchersMutation,
  useFindDisbursementVouchersQuery,
  useLookUpDisbursementVouchersMutation,
  useSaveDisbursementVouchersMutation,
  useSubmitDisbursementVouchersMutation,
  useReturnDisbursementVouchersMutation,
  useApproveDisbursementVouchersMutation,
  useRejectDisbursementVouchersMutation,
  useCancelDisbursementVouchersMutation,
  useDeleteDisbursementVouchersMutation
} = disbursementVouchersAPI;
