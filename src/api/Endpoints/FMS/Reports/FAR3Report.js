import getBuilders from "@/api/Utils/GetBuilders";
import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";

const baseURL = process.env.REACT_APP_FMS_API + '/reports/far3';

export const far3ReportAPI = createDynamicResourceAPI({
    resource: "FAR3Report",
    tagTypes: ["FAR3Report"],
    endpoints: (builder, resource) => {
        const { query } = getBuilders(builder);

        return {
            [`get${resource}`]: query(`${baseURL}/getData`, {
                serializeQueryArgs: ({ endpointName }) => endpointName,
                providesTags: (result) => result?.success
                    ? [
                        ...result.returnData.map(item => ({
                            type: resource,
                            id: item.logId,
                        })),
                        { type: resource, id: "LIST" },
                    ]
                    : [{ type: resource, id: "LIST" }],
            }),
        }
    },
});

export const {
    useGetFAR3ReportQuery,
} = far3ReportAPI;