import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'ListTreeTransactionTypes';

export const transactionTypesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/transactionTypes`,
    resource: "TransactionTypes",
    idKey: "transactionTypeId",
    tagTypes: ["Settings", "TransactionTypes"],
    lookupMap: ({ transactionTypeId, parentId, parentName, transactionTypeName }) => ({
        value: transactionTypeId,
        label: transactionTypeName,
        transactionTypeId: transactionTypeId,
        transactionTypeName: transactionTypeName
    }),
    customQuery: (query, { idKey }) => ({
        listTreeTransactionTypes: query(`${process.env.REACT_APP_FMS_API}/staticdata/transactionTypes/listTree`, {
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
            tags.push({ type: type, id: patch.transactionTypeId });
        }
        return tags;
    },
});

export const {
    useGetTransactionTypesQuery,
    useFindTransactionTypesQuery,
    useLookUpTransactionTypesMutation,
    useDeleteTransactionTypesMutation,
    useSaveTransactionTypesMutation,
    useExportTransactionTypesMutation,
    useListTreeTransactionTypesQuery,
} = transactionTypesAPI;