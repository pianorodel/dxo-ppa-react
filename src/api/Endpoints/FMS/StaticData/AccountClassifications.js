import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'ACCOUNT_CLASSIFICATIONS';

export const accountClassificationAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/accountClassifications`,
    resource: "AccountClassifications",
    idKey: "accountClassificationId",
    tagTypes: ["Settings", "AccountClassifications"],
    lookupMap: ({ accountClassificationId, parentId, parentName, accountClassificationCode, accountClassificationName }) => ({
        value: accountClassificationId,
        label: accountClassificationName,
        accountClassificationId: accountClassificationId,
        accountClassificationCode: accountClassificationCode,
        accountClassificationName: accountClassificationName
    }),
    customQuery: (query, { idKey }) => ({
        listTreeAccountClassifications: query(`${process.env.REACT_APP_FMS_API}/staticdata/accountClassifications/listTree`, {
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
            tags.push({ type: type, id: patch.classificationId });
        }
        return tags;
    },
});

export const {
    useGetAccountClassificationsQuery,
    useFindAccountClassificationsQuery,
    useLookUpAccountClassificationsMutation,
    useDeleteAccountClassificationsMutation,
    useSaveAccountClassificationsMutation,
    useExportAccountClassificationsMutation,
    useListTreeAccountClassificationsQuery,
} = accountClassificationAPI;