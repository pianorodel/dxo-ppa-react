import { baseApi } from "../api";

export default function createMockResourceAPI({
  resource = "",
  idKey = "",
  tagTypes = [],
  mockData = [],
  lookupMap = () => {},
  generateId = () => `mock-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  delay = 300,
}) {
  let mockStore = [...mockData];

  const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, delay));

  const taggedApi = baseApi.enhanceEndpoints({
    addTagTypes: tagTypes,
  });

  const apiSlice = taggedApi.injectEndpoints({
    endpoints(builder) {
      return {
        [`get${resource}`]: builder.query({
          queryFn: async () => {
            await simulateDelay();
            return {
              data: {
                success: true,
                items: [...mockStore],
                returnData: [...mockStore],
                totalRecords: mockStore.length,
              },
            };
          },
          providesTags: (result) =>
            result?.success
              ? [
                  ...mockStore.map((item) => ({
                    type: resource,
                    id: item[idKey],
                  })),
                  { type: resource, id: "LIST" },
                ]
              : [{ type: resource, id: "LIST" }],
        }),

        [`find${resource}`]: builder.query({
          queryFn: async (arg) => {
            await simulateDelay();
            const item = mockStore.find((i) => i[idKey] === arg[idKey]);

            if (!item) {
              return {
                error: {
                  status: 404,
                  data: { success: false, message: "Item not found" },
                },
              };
            }

            return {
              data: {
                success: true,
                returnData: item,
              },
            };
          },
          providesTags: (result, error, arg) => (result?.success ? [{ type: resource, id: arg[idKey] }] : [{ type: resource, id: "FIND" }]),
        }),

        [`lookUp${resource}`]: builder.mutation({
          queryFn: async () => {
            await simulateDelay();
            return {
              data: {
                success: true,
                returnData: mockStore.map(lookupMap),
              },
            };
          },
        }),

        [`save${resource}`]: builder.mutation({
          queryFn: async (patch) => {
            await simulateDelay();

            const id = patch[idKey];

            if (id) {
              const index = mockStore.findIndex((item) => item[idKey] === id);
              if (index !== -1) {
                mockStore[index] = { ...mockStore[index], ...patch };
                return {
                  data: {
                    success: true,
                    returnData: mockStore[index],
                    message: "Updated successfully",
                  },
                };
              } else {
                return {
                  error: {
                    status: 404,
                    data: { success: false, message: "Item not found" },
                  },
                };
              }
            } else {
              const newId = generateId();
              const newItem = { ...patch, [idKey]: newId };
              mockStore.unshift(newItem);
              return {
                data: {
                  success: true,
                  returnData: newItem,
                  message: "Created successfully",
                },
              };
            }
          },
          invalidatesTags: (result, error, patch) => {
            if (result?.success) {
              return [
                { type: resource, id: "LIST" },
                { type: resource, id: patch[idKey] || result.returnData[idKey] },
              ];
            }
            return [];
          },
        }),

        [`delete${resource}`]: builder.mutation({
          queryFn: async (patch) => {
            await simulateDelay();

            const id = patch[idKey];
            const index = mockStore.findIndex((item) => item[idKey] === id);

            if (index !== -1) {
              const deleted = mockStore.splice(index, 1)[0];
              return {
                data: {
                  success: true,
                  returnData: deleted,
                  message: "Deleted successfully",
                },
              };
            } else {
              return {
                error: {
                  status: 404,
                  data: { success: false, message: "Item not found" },
                },
              };
            }
          },
          invalidatesTags: (result, error, patch) => {
            if (result?.success) {
              return [
                { type: resource, id: "LIST" },
                { type: resource, id: patch[idKey] },
              ];
            }
            return [];
          },
        }),

        [`export${resource}`]: builder.mutation({
          queryFn: async (params) => {
            await simulateDelay();

            const headers = Object.keys(mockStore[0] || {}).join(",");
            const rows = mockStore.map((item) =>
              Object.values(item)
                .map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v))
                .join(","),
            );
            const csv = [headers, ...rows].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${resource}-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return {
              data: {
                success: true,
                message: "Export completed",
              },
            };
          },
        }),

        [`reset${resource}`]: builder.mutation({
          queryFn: async () => {
            mockStore = [...mockData];
            return {
              data: {
                success: true,
                message: "Mock data reset",
              },
            };
          },
          invalidatesTags: [{ type: resource, id: "LIST" }],
        }),
      };
    },
  });

  return apiSlice;
}
