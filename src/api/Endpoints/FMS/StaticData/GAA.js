import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

export const gaasAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/gaas`,
    resource: "Gaas",
    idKey: "gaaId",
    tagTypes: ["Settings", "Gaas"],
    lookupMap: ({ gaaId, gaaName }) => ({
        value: gaaId,
        label: gaaName,
    }),
});

export const {
    useGetGaasQuery,
    useFindGaasQuery,
    useLookUpGaasMutation,
    useDeleteGaasMutation,
    useSaveGaasMutation,
    useExportGaasMutation,
} = gaasAPI;
