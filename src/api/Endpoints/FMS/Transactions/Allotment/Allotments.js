import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/allotments';
const type = "Allotments";
const currentUser = getCurrentUser();

export const allotmentsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "Allotments",
  tagTypes: ["Allotments"],
  idKey: "allotmentId",
  lookupMap: ({ allotmentId, referenceNo }) => ({
    value: allotmentId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListAllotmentsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesAllotments: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitAllotments: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnAllotments: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveAllotments: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectAllotments: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelAllotments: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadAllotments: mutation(`${baseURL}/files/upload`),
    filesDeleteAllotments: mutation(`${baseURL}/files/delete`),
    exportListForViewerAllotments: builder.mutation({
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
          link.download = `Allotments-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
    lookUpForObligationAllotments: mutation(
      `${baseURL}/lookupForObligation`,
      {
        transformResponse: (res) =>
          (res?.returnData || []).map((item) => ({
            ...item,
            value: item.allotmentId,
            label: item.referenceNo,
          })),
      })
  }),
});

export const {
  useGetAllotmentsQuery,
  useGetListAllotmentsForViewersQuery,
  useExportAllotmentsMutation,
  useFindAllotmentsQuery,
  useLookUpAllotmentsMutation,
  useSaveAllotmentsMutation,
  useSubmitAllotmentsMutation,
  useReturnAllotmentsMutation,
  useApproveAllotmentsMutation,
  useRejectAllotmentsMutation,
  useCancelAllotmentsMutation,
  useDeleteAllotmentsMutation,
  useFilesUploadAllotmentsMutation,
  useFilesDeleteAllotmentsMutation,
  useGetFilesAllotmentsQuery,
  useExportListForViewerAllotmentsMutation,
  useLookUpForObligationAllotmentsMutation,
} = allotmentsAPI;
