import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/obligations';
const type = "Obligations";
const currentUser = getCurrentUser();

export const obligationsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "Obligations",
  tagTypes: ["Obligations"],
  idKey: "obligationId",
  lookupMap: ({ obligationId, referenceNo }) => ({
    value: obligationId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListObligationsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesObligations: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitObligations: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnObligations: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveObligations: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectObligations: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelObligations: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadObligations: mutation(`${baseURL}/files/upload`),
    filesDeleteObligations: mutation(`${baseURL}/files/delete`),
    exportListForViewerObligations: builder.mutation({
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
          link.download = `Obligations-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetObligationsQuery,
  useGetListObligationsForViewersQuery,
  useExportObligationsMutation,
  useFindObligationsQuery,
  useLookUpObligationsMutation,
  useSaveObligationsMutation,
  useSubmitObligationsMutation,
  useReturnObligationsMutation,
  useApproveObligationsMutation,
  useRejectObligationsMutation,
  useCancelObligationsMutation,
  useDeleteObligationsMutation,
  useFilesUploadObligationsMutation,
  useFilesDeleteObligationsMutation,
  useGetFilesObligationsQuery,
  useExportListForViewerObligationsMutation
} = obligationsAPI;
