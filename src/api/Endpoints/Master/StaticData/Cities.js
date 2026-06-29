import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'CITIES';

export const citiesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/cities`,
    resource: "Cities",
    idKey: "cityId",
    tagTypes: ["CORE", "Cities"],
    lookupMap: ({ cityId, cityName }) => ({
        value: cityId,
        label: cityName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.cityId });
        }
        return tags; 
    },
});

export const {
    useGetCitiesQuery,
    useFindCitiesQuery,
    useLookUpCitiesMutation,
    useDeleteCitiesMutation,
    useSaveCitiesMutation,
    useExportCitiesMutation,
} = citiesAPI;
