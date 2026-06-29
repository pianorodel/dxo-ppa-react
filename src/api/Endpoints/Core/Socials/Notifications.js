import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";
import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_CORE_API + '/socials/notifications';

export const notificationsAPI = createDynamicResourceAPI({
    resource: "Notifications",
    tagTypes: ["Notifications"],
    endpoints: (builder, resource) => {
        const { query, mutation } = getBuilders(builder);

        return {
            [`listUnread${resource}`]: query(`${baseURL}/listUnread`),
            [`listAll${resource}`]: query(`${baseURL}/listAll`, {
                defaultPayload: { page: 1, pageSize: 10, keyword: "" },
                method: "POST",
                transformResponse: (response, meta, arg) => ({
                    items: response.returnData.data,
                    totalRecords: response.returnData.totalRecords,
                    page: arg?.page ?? 1,
                    keyword: arg?.keyword ?? "",
                }),
                merge: (currentCache, newData) => {
                    const isFirstPage = newData.page === 1 || !currentCache?.items?.length;
                    currentCache.items = isFirstPage
                        ? newData.items
                        : [...(currentCache.items || []), ...(newData.items || [])];
                    currentCache.totalRecords = newData.totalRecords;
                    currentCache.keyword = newData.keyword;
                },
                serializeQueryArgs: ({ endpointName }) => endpointName,
            }),
            [`countUnRead${resource}`]: query(`${baseURL}/countUnRead`),
            [`countUnRead${resource}`]: query(`${baseURL}/countUnRead`),
            [`find${resource}`]: query(`${baseURL}/find`),
            [`notify${resource}`]: mutation(`${baseURL}/notify`),
            [`read${resource}`]: mutation(`${baseURL}/read`),
            [`readAll${resource}`]: mutation(`${baseURL}/readAll`),
            [`delete${resource}`]: mutation(`${baseURL}/delete`),
            [`deleleAll${resource}`]: mutation(`${baseURL}/deleleAll`),
        }
    },
});

export const {
    useListUnreadNotificationsQuery,
    useListAllNotificationsQuery,
    useCountUnReadNotificationsQuery,
    useFindNotificationsQuery,
    useNotifyNotificationsMutation,
    useReadNotificationsMutation,
    useReadAllNotificationsMutation,
    useDeleteNotificationsMutation,
    useDeleteAllNotificationsMutation,
} = notificationsAPI;

