import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'FUNDCATEGORIES';

export const fundcategoriesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/fundcategories`,
    resource: "FundCategories",
    idKey: "fundCategoryId",
    tagTypes: ["FMS", "FundCategories"],
    lookupMap: ({ fundCategoryId, fundCategoryName }) => ({
        value: fundCategoryId,
        label: fundCategoryName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.fundCategoryId });
        }
        return tags; 
    },
});

export const {
    useGetFundCategoriesQuery,
    useFindFundCategoriesQuery,
    useLookUpFundCategoriesMutation,
    useDeleteFundCategoriesMutation,
    useSaveFundCategoriesMutation,
    useExportFundCategoriesMutation,
} = fundcategoriesAPI;
