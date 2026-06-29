import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";

import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_CORE_API + "/app/systemLogs";
const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

export const systemLogsAPI = createDynamicResourceAPI({
  resource: "SystemLogs",
  tagTypes: ["SystemLogs"],
  endpoints: (builder, resource) => {
    const { query, mutation } = getBuilders(builder);

    return {
      [`getList${resource}`]: query(`${baseURL}/list`, {
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
        },
      }),
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
          currentCache.items = isFirstPage ? newData.items : [...(currentCache.items || []), ...(newData.items || [])];
          currentCache.totalRecords = newData.totalRecords;
          currentCache.keyword = newData.keyword;
        },
        serializeQueryArgs: ({ endpointName }) => endpointName,
      }),
      [`getUserDetails${resource}`]: query(`${baseURL}/list`, {
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
          currentCache.items = isFirstPage ? newData.items : [...(currentCache.items || []), ...(newData.items || [])];
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
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${currentUser.token}`,
        }),
        async onQueryStarted(params, { queryFulfilled }) {
          try {
            const response = await fetch(`${baseURL}/export`, {
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
            link.download = `${resource}-${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            await queryFulfilled.catch(() => {});
          } catch (err) {
            console.error("Export failed:", err);
            throw err;
          }
        },
      }),
    };
  },
});

export const { useGetSystemLogsQuery, useGetUserDetailsSystemLogsQuery, useExportSystemLogsMutation, useGetListSystemLogsQuery } = systemLogsAPI;
