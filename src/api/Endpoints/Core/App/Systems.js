import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";
import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_CORE_API + '/app/systems';
const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

export const systemsAPI = createDynamicResourceAPI({
    resource: "Systems",
    tagTypes: ["Systems"],
    endpoints: (builder, resource) => {
        const { query, mutation } = getBuilders(builder);

        return {
            [`lookUp${resource}`]: mutation(`${baseURL}/lookup`, {
                transformResponse: (res) => [
                    { value: 0, label: "All Systems" },
                    ...(res?.returnData || []).map(({ systemId, systemName }) => ({
                        value: systemId,
                        label: systemName,
                    })),
                ],
            }),
        }
    },
});

export const {
    useLookUpSystemsMutation,
} = systemsAPI;
