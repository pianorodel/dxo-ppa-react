import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/lddaps';
const type = "LDDAPs";
const currentUser = getCurrentUser();

export const lDDAPsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "LDDAPs",
  tagTypes: ["LDDAPs"],
  idKey: "lddapId",
  lookupMap: ({ lddapId, referenceNo }) => ({
    value: lddapId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListLDDAPsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesLDDAPs: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitLDDAPs: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnLDDAPs: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveLDDAPs: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectLDDAPs: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelLDDAPs: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadLDDAPs: mutation(`${baseURL}/files/upload`),
    filesDeleteLDDAPs: mutation(`${baseURL}/files/delete`),
    exportListForViewerLDDAPs: builder.mutation({
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
          link.download = `LDDAP-ADA-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetLDDAPsQuery,
  useGetListLDDAPsForViewersQuery,
  useExportLDDAPsMutation,
  useFindLDDAPsQuery,
  useLookUpLDDAPsMutation,
  useSaveLDDAPsMutation,
  useSubmitLDDAPsMutation,
  useReturnLDDAPsMutation,
  useApproveLDDAPsMutation,
  useRejectLDDAPsMutation,
  useCancelLDDAPsMutation,
  useDeleteLDDAPsMutation,
  useFilesUploadLDDAPsMutation,
  useFilesDeleteLDDAPsMutation,
  useGetFilesLDDAPsQuery,
  useExportListForViewerLDDAPsMutation
} = lDDAPsAPI;
