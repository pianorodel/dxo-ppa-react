import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

export const clientsAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/signatories/`,
    resource: "Signatories",
    idKey: "signatoryId",
    tagTypes: ["Settings", "signatories"],
    lookupMap: ({  signatoryId,name }) => ({
        value: signatoryId,
        label: name,
    }),
});

export const {
    useGetSignatoriesQuery,
    useFindSignatoriesQuery,
    useLookUpSignatoriesMutation,
    useDeleteSignatoriesMutation,
    useSaveSignatoriesMutation,
    useExportSignatoriesMutation,
} = clientsAPI;
