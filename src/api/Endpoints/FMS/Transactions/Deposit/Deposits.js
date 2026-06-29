import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/deposits';
const type = "Deposits";
const currentUser = getCurrentUser();

export const depositsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "Deposits",
  tagTypes: ["Deposits"],
  idKey: "depositId",
  lookupMap: ({ depositId, referenceNo }) => ({
    value: depositId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListDepositsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesDeposits: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitDeposits: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnDeposits: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveDeposits: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectDeposits: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelDeposits: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadDeposits: mutation(`${baseURL}/files/upload`),
    filesDeleteDeposits: mutation(`${baseURL}/files/delete`),
    exportListForViewerDeposits: builder.mutation({
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
          link.download = `Deposits-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetDepositsQuery,
  useGetListDepositsForViewersQuery,
  useExportDepositsMutation,
  useFindDepositsQuery,
  useLookUpDepositsMutation,
  useSaveDepositsMutation,
  useSubmitDepositsMutation,
  useReturnDepositsMutation,
  useApproveDepositsMutation,
  useRejectDepositsMutation,
  useCancelDepositsMutation,
  useDeleteDepositsMutation,
  useFilesUploadDepositsMutation,
  useFilesDeleteDepositsMutation,
  useGetFilesDepositsQuery,
  useExportListForViewerDepositsMutation
} = depositsAPI;
