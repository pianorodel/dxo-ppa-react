import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

export const bursAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/burs`,
    resource: "Burs",
    idKey: "burId",
    tagTypes: ["Budget", "Burs"],
    lookupMap: ({ burId, burName }) => ({
        value: burId,
        label: burName,
    }),
});

export const {
    useGetBursQuery,
    useFindBursQuery,
    useLookUpBursMutation,
    useDeleteBursMutation,
    useSaveBursMutation,
    useExportBursMutation,
} = bursAPI;
