import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/collections';
const type = "Collections";
const currentUser = getCurrentUser();

export const collectionsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "Collections",
  tagTypes: ["Collections"],
  idKey: "collectionId",
  lookupMap: ({ collectionId, referenceNo }) => ({
    value: collectionId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListCollectionsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesCollections: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitCollections: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnCollections: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveCollections: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectCollections: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelCollections: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadCollections: mutation(`${baseURL}/files/upload`),
    filesDeleteCollections: mutation(`${baseURL}/files/delete`),
    exportListForViewerCollections: builder.mutation({
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
          link.download = `Collections-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetCollectionsQuery,
  useGetListCollectionsForViewersQuery,
  useExportCollectionsMutation,
  useFindCollectionsQuery,
  useLookUpCollectionsMutation,
  useSaveCollectionsMutation,
  useSubmitCollectionsMutation,
  useReturnCollectionsMutation,
  useApproveCollectionsMutation,
  useRejectCollectionsMutation,
  useCancelCollectionsMutation,
  useDeleteCollectionsMutation,
  useFilesUploadCollectionsMutation,
  useFilesDeleteCollectionsMutation,
  useGetFilesCollectionsQuery,
  useExportListForViewerCollectionsMutation
} = collectionsAPI;
