import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/prepayments';
const type = "Prepayments";
const currentUser = getCurrentUser();

export const prepaymentsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "Prepayments",
  tagTypes: ["Prepayments"],
  idKey: "prepaymentId",
  lookupMap: ({ prepaymentId, referenceNo }) => ({
    value: prepaymentId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListPrepaymentsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesPrepayments: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitPrepayments: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnPrepayments: mutation(`${baseURL}/return`, mutationOptions("save")),
    approvePrepayments: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectPrepayments: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelPrepayments: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadPrepayments: mutation(`${baseURL}/files/upload`),
    filesDeletePrepayments: mutation(`${baseURL}/files/delete`),
    exportListForViewerPrepayments: builder.mutation({
      query: (params) => ({
        url: `${baseURL}/exportListForViewer`,
        method: "POST",
        body: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      }),
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const response = await fetch(`${baseURL}/exportListForViewer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify(params),
          });

          if (!response.ok) throw new Error("Export failed");

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Prepayments-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          await queryFulfilled.catch(() => { });
        } catch (err) {
          console.error("Export failed:", err);
          throw err;
        }
      },
    }),
  }),
});

export const {
  useGetPrepaymentsQuery,
  useGetListPrepaymentsForViewersQuery,
  useExportPrepaymentsMutation,
  useFindPrepaymentsQuery,
  useLookUpPrepaymentsMutation,
  useSavePrepaymentsMutation,
  useSubmitPrepaymentsMutation,
  useReturnPrepaymentsMutation,
  useApprovePrepaymentsMutation,
  useRejectPrepaymentsMutation,
  useCancelPrepaymentsMutation,
  useDeletePrepaymentsMutation,
  useFilesUploadPrepaymentsMutation,
  useFilesDeletePrepaymentsMutation,
  useGetFilesPrepaymentsQuery,
  useExportListForViewerPrepaymentsMutation
} = prepaymentsAPI;
