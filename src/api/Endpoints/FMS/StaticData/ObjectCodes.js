import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'OBJECTCODES';

export const objectcodesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/objectcodes`,
    resource: "ObjectCodes",
    idKey: "objectCodeId",
    tagTypes: ["FMS", "ObjectCodes"],
    lookupMap: (data) => ({
        ...data,
        value: data?.objectCodeId,
        label: data?.displayName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.objectCodeId });
        }
        return tags;
    },
});

export const {
    useGetObjectCodesQuery,
    useFindObjectCodesQuery,
    useLookUpObjectCodesMutation,
    useDeleteObjectCodesMutation,
    useSaveObjectCodesMutation,
    useExportObjectCodesMutation,
} = objectcodesAPI;
