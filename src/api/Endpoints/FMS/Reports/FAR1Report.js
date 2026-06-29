import getBuilders from "@/api/Utils/GetBuilders";
import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";

const baseURL = process.env.REACT_APP_FMS_API + '/reports/far1';

export const far1ReportAPI = createDynamicResourceAPI({
    resource: "FAR1Report",
    tagTypes: ["FAR1Report"],
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
    useGetFAR1ReportQuery,
} = far1ReportAPI;