import getBuilders from "@/api/Utils/GetBuilders";
import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_FMS_API + '/transactions/collections/logs';
const currentUser = getCurrentUser();

export const collectionLogsAPI = createDynamicResourceAPI({
  resource: "CollectionLogs",
  tagTypes: ["CollectionLogs"],
  endpoints: (builder, resource) => {
    const { query, mutation } = getBuilders(builder);
    return {
      [`get${resource}`]: query(`${baseURL}/list`, {
        defaultPayload: { page: 1, pageSize: 10, keyword: "" },
        method: "POST",
        transformResponse: (response, meta, arg) => ({
          items: response.returnData.data,
          totalRecords: response.returnData.totalRecords,
          page: arg?.page ?? 1,
          keyword: arg?.keyword ?? "",
        }),
        merge: (currentCache, newData) => {
          const isFirstPage = newData.page === 1 || !currentCache?.items?.length;
          currentCache.items = isFirstPage
            ? newData.items
            : [...(currentCache.items || []), ...(newData.items || [])];
          currentCache.totalRecords = newData.totalRecords;
          currentCache.keyword = newData.keyword;
        },
        serializeQueryArgs: ({ endpointName }) => endpointName,
      }),
      [`export${resource}`]: builder.mutation({
        query: (params) => ({
          url: `${baseURL}/export`,
          method: "POST",
          body: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }),
        async onQueryStarted(params, { queryFulfilled }) {
          try {
            const response = await fetch(
              `${baseURL}/export`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify(params),
              }
            );

            if (!response.ok)
              throw new Error(`Export failed: ${response.statusText}`);

            const blob = await response.blob();
            if (!blob || blob.size === 0)
              throw new Error("Empty file received");

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `CollectionLogs-${new Date().toISOString().split("T")[0]}.xlsx`;
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
    }
  },
});

export const {
  useGetCollectionLogsQuery,
  useExportCollectionLogsMutation
} = collectionLogsAPI;
