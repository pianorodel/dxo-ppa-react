import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/noticeOfCashAllocations';
const type = "NoticeOfCashAllocations";
const currentUser = getCurrentUser();

export const noticeOfCashAllocationsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "NoticeOfCashAllocations",
  tagTypes: ["NoticeOfCashAllocations"],
  idKey: "noticeOfCashAllocationId",
  lookupMap: ({ noticeOfCashAllocationId, referenceNo }) => ({
    value: noticeOfCashAllocationId,
    label: referenceNo
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListNoticeOfCashAllocationsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesNoticeOfCashAllocations: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitNoticeOfCashAllocations: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnNoticeOfCashAllocations: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveNoticeOfCashAllocations: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectNoticeOfCashAllocations: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelNoticeOfCashAllocations: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadNoticeOfCashAllocations: mutation(`${baseURL}/files/upload`),
    filesDeleteNoticeOfCashAllocations: mutation(`${baseURL}/files/delete`),
    exportListForViewerNoticeOfCashAllocations: builder.mutation({
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
          link.download = `Notice Of Cash Allocations-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetNoticeOfCashAllocationsQuery,
  useGetListNoticeOfCashAllocationsForViewersQuery,
  useExportNoticeOfCashAllocationsMutation,
  useFindNoticeOfCashAllocationsQuery,
  useLookUpNoticeOfCashAllocationsMutation,
  useSaveNoticeOfCashAllocationsMutation,
  useSubmitNoticeOfCashAllocationsMutation,
  useReturnNoticeOfCashAllocationsMutation,
  useApproveNoticeOfCashAllocationsMutation,
  useRejectNoticeOfCashAllocationsMutation,
  useCancelNoticeOfCashAllocationsMutation,
  useDeleteNoticeOfCashAllocationsMutation,
  useFilesUploadNoticeOfCashAllocationsMutation,
  useFilesDeleteNoticeOfCashAllocationsMutation,
  useGetFilesNoticeOfCashAllocationsQuery,
  useExportListForViewerNoticeOfCashAllocationsMutation
} = noticeOfCashAllocationsAPI;
