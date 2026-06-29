import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";
const type = 'PROJECTCATEGORIES';

export const projectcategoriesAPI = createStaticResourceAPI({
    baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/projectcategories`,
    resource: "ProjectCategories",
    idKey: "projectCategoryId",
    tagTypes: ["FMS", "ProjectCategories"],
    lookupMap: ({ projectCategoryId, projectCategoryName }) => ({
        value: projectCategoryId,
        label: projectCategoryName,
    }),
    getInvalidationTags: ({ mode, patch }) => {
        const tags = [{ type: type, id: type }];
        if (mode === 'save' || mode === 'delete') {
            tags.push({ type: type, id: patch.projectCategoryId });
        }
        return tags; 
    },
});

export const {
    useGetProjectCategoriesQuery,
    useFindProjectCategoriesQuery,
    useLookUpProjectCategoriesMutation,
    useDeleteProjectCategoriesMutation,
    useSaveProjectCategoriesMutation,
    useExportProjectCategoriesMutation,
} = projectcategoriesAPI;
