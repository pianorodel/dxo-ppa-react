import { baseApi } from "@/api";
import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_FMS_API;

const taggedApi = baseApi.enhanceEndpoints({
  addTagTypes: ["Clients"],
});

export const clientTypesLookupAPI = taggedApi.injectEndpoints({
  endpoints(builder) {
    const { mutation } = getBuilders(builder);

    return {
      LookupClientypes: mutation(`${baseURL}/enums/clientTypes/lookup`, {
        transformResponse: (res) =>
          (res?.returnData || []).map(({ clientTypeId, clientTypeName }) => ({
            value: clientTypeId,
            label: clientTypeName,
          })),
      }),
    };
  },
});

export const {
  useLookupClientypesMutation,
} = clientTypesLookupAPI;
