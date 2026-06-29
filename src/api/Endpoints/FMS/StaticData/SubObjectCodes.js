import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'SUBOBJECTCODES';

export const subobjectcodesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/subobjectcodes`,
    resource: "SubObjectCodes",
    idKey: "subObjectCodeId",
    tagTypes: ["FMS", "SubObjectCodes"],
    lookupMap: ({ subObjectCodeId, subObjectCodeName, uacs }) => ({
        value: subObjectCodeId,
        label: subObjectCodeName,
        uacs: uacs,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.subObjectCodeId });
        }
        return tags; 
    },
});

export const {
    useGetSubObjectCodesQuery,
    useFindSubObjectCodesQuery,
    useLookUpSubObjectCodesMutation,
    useDeleteSubObjectCodesMutation,
    useSaveSubObjectCodesMutation,
    useExportSubObjectCodesMutation,
} = subobjectcodesAPI;
