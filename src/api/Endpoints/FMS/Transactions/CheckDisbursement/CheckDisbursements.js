import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/checkDisbursements';

export const checkDisbursementsAPI = createStaticResourceAPI({
  baseURL: baseURL,
  resource: "CheckDisbursements",
  tagTypes: ["CheckDisbursements"],
  idKey: "checkDisbursementId",
  lookupMap: ({ checkDisbursementId, referenceNo }) => ({
    value: checkDisbursementId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListCheckDisbursementsForViewers: query(`${baseURL}/listForViewer`, {
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
    submitCheckDisbursements: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnCheckDisbursements: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveCheckDisbursements: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectCheckDisbursements: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelCheckDisbursements: mutation(`${baseURL}/cancel`, mutationOptions("save")),
  }),
});

export const {
  useGetCheckDisbursementsQuery,
  useGetListCheckDisbursementsForViewersQuery,
  useExportCheckDisbursementsMutation,
  useFindCheckDisbursementsQuery,
  useLookUpCheckDisbursementsMutation,
  useSaveCheckDisbursementsMutation,
  useSubmitCheckDisbursementsMutation,
  useReturnCheckDisbursementsMutation,
  useApproveCheckDisbursementsMutation,
  useRejectCheckDisbursementsMutation,
  useCancelCheckDisbursementsMutation,
  useDeleteCheckDisbursementsMutation
} = checkDisbursementsAPI;
