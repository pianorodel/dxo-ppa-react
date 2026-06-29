import { baseApi } from "../api";

export default function createDynamicResourceAPI({
    resource = '',
    tagTypes = [],
    endpoints = () => ({}),
}) {
    const taggedApi = baseApi.enhanceEndpoints({
        addTagTypes: tagTypes,
    });

    const apiSlice = taggedApi.injectEndpoints({
        endpoints(builder) {
            return endpoints(builder, resource);
        },
    });

    return apiSlice;
}
