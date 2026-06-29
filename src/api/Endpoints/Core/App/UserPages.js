import getBuilders from "@/api/Utils/GetBuilders";
import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";

const baseURL = process.env.REACT_APP_CORE_API + '/app/pages';

export const userPagesAPI = createDynamicResourceAPI({
    resource: "UserPages",
    tagTypes: ["UserPages"],
    endpoints: (builder, resource) => {
        const { query, mutation } = getBuilders(builder);

        return {
            [`listFavorites${resource}`]: query(`${baseURL}/list-favorites`),
        }
    },
});

export const {
    useListFavoritesUserPagesQuery,
} = userPagesAPI;

