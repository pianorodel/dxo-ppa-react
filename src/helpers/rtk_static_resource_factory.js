import { baseApi } from "../api";
import getBuilders from "../api/Utils/GetBuilders";

export default function createStaticResourceAPI({
  baseURL = "",
  resource = "",
  idKey = "",
  tagTypes = [],
  lookupMap = () => { },
  customMutations = () => ({}),
  customQuery = () => ({}),
  getInvalidationTags = () => () => [],
  refetchConfig = {},
}) {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

  const mutationOptions = (mode = "save") => ({
    async onQueryStarted(patch, { dispatch, queryFulfilled }) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const stripNonSerializable = (obj) => {
        if (!obj || typeof obj !== "object") return obj;

        const clean = {};

        for (const [key, value] of Object.entries(obj)) {
          // Skip File, Blob objects and arrays containing them
          if (value instanceof File || value instanceof Blob) {
            continue;
          }
          if (Array.isArray(value) && value.some((v) => v instanceof File || v instanceof Blob)) {
            continue;
          }
          clean[key] = value;
        }

        return clean;
      };

      const safePatch = stripNonSerializable(patch);

      const patchResult = dispatch(
        baseApi.util.updateQueryData(`get${resource}`, undefined, (draft) => {
          const list = draft?.items || draft?.returnData;
          if (!list) return;

          const id = patch?.[idKey];

          if (id) {
            const target = list.find((item) => item[idKey] === id);
            if (target) {
              if (mode === "delete") {
                draft.items = list.filter((item) => item[idKey] !== id);
                draft.totalRecords -= 1;
              } else {
                Object.assign(target, safePatch);
              }
            }
          } else {
            list.unshift({ ...safePatch, [idKey]: tempId });
            draft.totalRecords += 1;
          }
        }),
      );

      try {
        const { data } = await queryFulfilled;
        const safeReturnData = stripNonSerializable(data?.returnData);

        dispatch(
          baseApi.util.updateQueryData(`get${resource}`, undefined, (draft) => {
            const list = draft?.items || draft?.returnData;
            if (!list) return;

            const index = list.findIndex((item) => item[idKey] === tempId || item[idKey] === patch?.[idKey]);

            if (index !== -1) {
              list[index] = {
                ...list[index],
                ...safeReturnData,
              };
            }
          }),
        );

        const extraQueries = customQuery(() => { }, { resource, idKey, baseURL, tagTypes });

        Object.entries(extraQueries).forEach(([name]) => {
          const meta = refetchConfig[name];
          if (meta && meta.refetchOnSave && mode === "save" && apiSlice.endpoints[name]) {
            dispatch(apiSlice.endpoints[name].initiate(undefined, { forceRefetch: true }));
          }
          if (meta && meta.refetchOnDelete && mode === "delete" && apiSlice.endpoints[name]) {
            dispatch(apiSlice.endpoints[name].initiate(undefined, { forceRefetch: true }));
          }
        });
      } catch {
        patchResult.undo();
      }
    },
    invalidatesTags: (result, error, patch) => {
      const tags = getInvalidationTags({ mode, patch, result, error, resource, idKey });
      return Array.isArray(tags) ? tags : [];
    },
  });

  const taggedApi = baseApi.enhanceEndpoints({
    addTagTypes: tagTypes,
  });

  const apiSlice = taggedApi.injectEndpoints({
    endpoints(builder) {
      const { query, mutation } = getBuilders(builder);

      const defaultEndpoints = {
        [`get${resource}`]: query(`${baseURL}/list`, {
          serializeQueryArgs: ({ endpointName }) => endpointName,
          providesTags: (result) =>
            result?.success
              ? [
                ...(result?.items || result?.returnData).map((item) => ({
                  type: resource,
                  id: item[idKey],
                })),
                { type: resource, id: "LIST" },
              ]
              : [{ type: resource, id: "LIST" }],
        }),

        [`find${resource}`]: query(`${baseURL}/find`, {
          providesTags: (result, error, arg) => (result?.success ? [{ type: resource, id: arg[idKey] }] : [{ type: resource, id: "FIND" }]),
        }),

        [`lookUp${resource}`]: mutation(`${baseURL}/lookup`, {
          transformResponse: (res) => (res?.returnData || []).map(lookupMap),
        }),

        [`delete${resource}`]: mutation(`${baseURL}/delete`, mutationOptions("delete")),
        [`save${resource}`]: mutation(`${baseURL}/save`, mutationOptions("save")),

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

              await queryFulfilled.catch(() => { });
            } catch (err) {
              console.error("Export failed:", err);
              throw err;
            }
          },
        }),
      };

      const extraMutations = customMutations(mutation, mutationOptions, builder);
      const extraQuery = customQuery(query, { resource, idKey, baseURL, tagTypes });

      return {
        ...defaultEndpoints,
        ...extraMutations,
        ...extraQuery,
      };
    },
  });

  return apiSlice;
}