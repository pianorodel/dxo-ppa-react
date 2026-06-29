import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_CORE_API + '/transactions/accessRequests';
const currentUser = getCurrentUser()

export const accessRequestsAPI = createStaticResourceAPI({
  baseURL: baseURL,
  resource: "AccessRequests",
  tagTypes: ["AccessRequests"],
  idKey: "accessRequestId",
  lookupMap: ({ accessRequestId, referenceNo }) => ({
    value: accessRequestId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListAccessRequestsForViewers: query(`${baseURL}/listForViewer`, {
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
  customMutations: (mutation, mutationOptions,builder) => ({
    submitAccessRequests: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnAccessRequests: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveAccessRequests: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectAccessRequests: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelAccessRequests: mutation(`${baseURL}/cancel`, mutationOptions("save")),

 exportListForViewerAccessRequests: builder.mutation({
      query: (params) => ({
        url: `${baseURL}/exportListForViewer`,
        method: "POST",
        body: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
      }),
      async onQueryStarted(params, { queryFulfilled }) {
        try {
          const response = await fetch(`${baseURL}/exportListForViewer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.token}`,
            },
            body: JSON.stringify(params),
          });

          if (!response.ok) throw new Error("Export failed");

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `AccessRequests-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetAccessRequestsQuery,
  useGetListAccessRequestsForViewersQuery,
  useExportAccessRequestsMutation,
  useFindAccessRequestsQuery,
  useLookUpAccessRequestsMutation,
  useSaveAccessRequestsMutation,
  useSubmitAccessRequestsMutation,
  useReturnAccessRequestsMutation,
  useApproveAccessRequestsMutation,
  useRejectAccessRequestsMutation,
  useCancelAccessRequestsMutation,
  useDeleteAccessRequestsMutation,
  useExportListForViewerAccessRequestsMutation
} = accessRequestsAPI;
