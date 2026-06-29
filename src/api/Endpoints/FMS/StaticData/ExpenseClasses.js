import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'EXPENSECLASSES';

export const expenseclassesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/expenseclasses`,
    resource: "ExpenseClasses",
    idKey: "expenseClassId",
    tagTypes: ["FMS", "ExpenseClasses"],
    lookupMap: (data) => ({
        ...data,
        value: data?.expenseClassId,
        label: data?.expenseClassName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.expenseClassId });
        }
        return tags; 
    },
});

export const {
    useGetExpenseClassesQuery,
    useFindExpenseClassesQuery,
    useLookUpExpenseClassesMutation,
    useDeleteExpenseClassesMutation,
    useSaveExpenseClassesMutation,
    useExportExpenseClassesMutation,
} = expenseclassesAPI;
