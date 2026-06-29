import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";
import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_CORE_API + '/app/search';

export const searchAPI = createDynamicResourceAPI({
    resource: "Search",
    tagTypes: ["Search"],
    endpoints: (builder, resource) => {
        const { query, mutation } = getBuilders(builder);

        return {
            [`app${resource}`]: mutation(`${baseURL}`),
        }
    },
});

export const {
    useAppSearchMutation,
} = searchAPI;
