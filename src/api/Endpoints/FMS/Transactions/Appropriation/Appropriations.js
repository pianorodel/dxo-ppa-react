import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/appropriations';
const type = "Appropriations";
const currentUser = getCurrentUser();

export const appropriationsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "Appropriations",
  tagTypes: ["Appropriations"],
  idKey: "appropriationId",
  lookupMap: ({ appropriationId, referenceNo }) => ({
    value: appropriationId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListAppropriationsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesAppropriations: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitAppropriations: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnAppropriations: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveAppropriations: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectAppropriations: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelAppropriations: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadAppropriations: mutation(`${baseURL}/files/upload`),
    filesDeleteAppropriations: mutation(`${baseURL}/files/delete`),
    exportListForViewerAppropriations: builder.mutation({
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
          link.download = `Appropriations-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
    lookUpForAllotmentAppropriations: mutation(
      `${baseURL}/lookupForAllotment`,
      {
        transformResponse: (res) =>
          (res?.returnData || []).map((item) => ({
            ...item,
            value: item.appropriationId,
            label: item.referenceNo,
          })),
      }
    ),
  }),
});

export const {
  useGetAppropriationsQuery,
  useGetListAppropriationsForViewersQuery,
  useExportAppropriationsMutation,
  useFindAppropriationsQuery,
  useLookUpAppropriationsMutation,
  useSaveAppropriationsMutation,
  useSubmitAppropriationsMutation,
  useReturnAppropriationsMutation,
  useApproveAppropriationsMutation,
  useRejectAppropriationsMutation,
  useCancelAppropriationsMutation,
  useDeleteAppropriationsMutation,
  useFilesUploadAppropriationsMutation,
  useFilesDeleteAppropriationsMutation,
  useGetFilesAppropriationsQuery,
  useExportListForViewerAppropriationsMutation,
  useLookUpForAllotmentAppropriationsMutation,
} = appropriationsAPI;
