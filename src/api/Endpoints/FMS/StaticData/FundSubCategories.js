import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'FUNDSUBCATEGORIES';

export const fundsubcategoriesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/fundsubcategories`,
    resource: "FundSubCategories",
    idKey: "fundSubCategoryId",
    tagTypes: ["FMS", "FundSubCategories"],
    lookupMap: ({ fundSubCategoryId, fundSubCategoryName, fundSubCategoryDisplayName }) => ({
        value: fundSubCategoryId,
        label: fundSubCategoryDisplayName,
        fundSubCategoryName: fundSubCategoryName
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.fundSubCategoryId });
        }
        return tags;
    },
});

export const {
    useGetFundSubCategoriesQuery,
    useFindFundSubCategoriesQuery,
    useLookUpFundSubCategoriesMutation,
    useDeleteFundSubCategoriesMutation,
    useSaveFundSubCategoriesMutation,
    useExportFundSubCategoriesMutation,
} = fundsubcategoriesAPI;
