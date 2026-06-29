import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'PROVINCES';

export const provincesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/provinces`,
    resource: "Provinces",
    idKey: "provinceId",
    tagTypes: ["CORE", "Provinces"],
    lookupMap: ({ provinceId, provinceName }) => ({
        value: provinceId,
        label: provinceName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.provinceId });
        }
        return tags; 
    },
});

export const {
    useGetProvincesQuery,
    useFindProvincesQuery,
    useLookUpProvincesMutation,
    useDeleteProvincesMutation,
    useSaveProvincesMutation,
    useExportProvincesMutation,
} = provincesAPI;
