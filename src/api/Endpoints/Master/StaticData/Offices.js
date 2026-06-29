import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'ListTreeOffices';

export const officesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_MASTER_API}/staticdata/offices`,
    resource: "Offices",
    idKey: "officeId",
    tagTypes: ["Settings", "Offices"],
    lookupMap: ({ officeId, parentId, parentName, officeName }) => ({
        value: officeId,
        label: officeName,
        officeId: officeId,
        officeName: officeName
    }),
    customQuery: (query, { idKey }) => ({
        listTreeOffices: query(`${process.env.REACT_APP_MASTER_API}/staticdata/offices/listTree`, {
            serializeQueryArgs: ({ endpointName }) => endpointName,
            providesTags: (result) => result?.success
                ? [
                    ...result.returnData?.map(item => ({ type: type, id: item[idKey] })),
                    { type: type, id: type },
                ]
                : [{ type: type, id: type }],
        }),
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.officeId });
        }
        return tags;
    },
});
 
export const {
    useGetOfficesQuery,
    useFindOfficesQuery,
    useLookUpOfficesMutation,
    useDeleteOfficesMutation,
    useSaveOfficesMutation,
    useExportOfficesMutation,
    useListTreeOfficesQuery,
} = officesAPI;