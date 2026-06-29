import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";

import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_FMS_API + "/assets/logs";

export const assetsLogsAPI = createDynamicResourceAPI({
  resource: "AssetsLogs",
  tagTypes: ["AssetsLogs"],
  endpoints: (builder, resource) => {
    const { query, mutation } = getBuilders(builder);

    return {
      [`get${resource}`]: query(`${baseURL}/list`, {
        serializeQueryArgs: ({ endpointName }) => endpointName,
        providesTags: (result) =>
          result?.success
            ? [
                ...result.items.map((item) => ({
                  type: resource,
                  id: item.logId,
                })),
                { type: resource, id: "LIST" },
              ]
            : [{ type: resource, id: "LIST" }],
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

export const { useGetAssetsLogsQuery, useExportAssetsLogsMutation } = assetsLogsAPI;
