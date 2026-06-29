import { baseApi } from "@/api";
import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_FMS_API;

const taggedApi = baseApi.enhanceEndpoints({
  addTagTypes: ["ProgramTypes"],
});

export const programTypesLookupAPI = taggedApi.injectEndpoints({
  endpoints(builder) {
    const { mutation } = getBuilders(builder);

    return {
      LookupProgramTypes: mutation(`${baseURL}/enums/programTypes/lookup`, {
        transformResponse: (res) =>
          (res?.returnData || []).map(({ programTypeId, programTypeName }) => ({
            value: programTypeId,
            label: programTypeName,
          })),
      }),
    };
  },
});

export const {
  useLookupProgramTypesMutation,
} = programTypesLookupAPI;
