import createTransactionsAPI from "@/helpers/rtk_transactions_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/orderOfPayments';
const type = "OrderOfPayments";
const currentUser = getCurrentUser();

export const orderOfPaymentsAPI = createTransactionsAPI({
  baseURL: baseURL,
  resource: "OrderOfPayments",
  tagTypes: ["OrderOfPayments"],
  idKey: "orderOfPaymentId",
  lookupMap: (data) => ({
    ...data,
    value: data?.orderOfPaymentId,
    label: data?.referenceNo,
  }),
  customQuery: (query, { idKey, resource, baseURL }) => ({
    getListOrderOfPaymentsForViewers: query(`${baseURL}/listForViewer`, {
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
    getFilesOrderOfPayments: query(`${baseURL}/files/list`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...(result?.items || result?.returnData)?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  customMutations: (mutation, mutationOptions, builder) => ({
    submitOrderOfPayments: mutation(`${baseURL}/submit`, mutationOptions("save")),
    returnOrderOfPayments: mutation(`${baseURL}/return`, mutationOptions("save")),
    approveOrderOfPayments: mutation(`${baseURL}/approve`, mutationOptions("save")),
    rejectOrderOfPayments: mutation(`${baseURL}/reject`, mutationOptions("save")),
    cancelOrderOfPayments: mutation(`${baseURL}/cancel`, mutationOptions("save")),
    filesUploadOrderOfPayments: mutation(`${baseURL}/files/upload`),
    filesDeleteOrderOfPayments: mutation(`${baseURL}/files/delete`),
    exportListForViewerOrderOfPayments: builder.mutation({
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
          link.download = `Order Of Payments-Viewer-${new Date().toISOString().split("T")[0]}.xlsx`;
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
  useGetOrderOfPaymentsQuery,
  useGetListOrderOfPaymentsForViewersQuery,
  useExportOrderOfPaymentsMutation,
  useFindOrderOfPaymentsQuery,
  useLookUpOrderOfPaymentsMutation,
  useSaveOrderOfPaymentsMutation,
  useSubmitOrderOfPaymentsMutation,
  useReturnOrderOfPaymentsMutation,
  useApproveOrderOfPaymentsMutation,
  useRejectOrderOfPaymentsMutation,
  useCancelOrderOfPaymentsMutation,
  useDeleteOrderOfPaymentsMutation,
  useFilesUploadOrderOfPaymentsMutation,
  useFilesDeleteOrderOfPaymentsMutation,
  useGetFilesOrderOfPaymentsQuery,
  useExportListForViewerOrderOfPaymentsMutation
} = orderOfPaymentsAPI;
