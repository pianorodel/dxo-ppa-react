import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const type = "PROGRAMS";

export const fmsProgramsAPI = createStaticResourceAPI({
  baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/programs`,
  resource: "FMSPrograms",
  idKey: "programId",
  tagTypes: ["Settings", "Programs"],
  lookupMap: ({ programId, programName }) => ({
    value: programId,
    label: programName,
  }),
  customQuery: (query, { idKey }) => ({
    listTreeFMSPrograms: query(`${process.env.REACT_APP_FMS_API}/staticdata/programs/listTree`, {
      serializeQueryArgs: ({ endpointName }) => endpointName,
      providesTags: (result) =>
        result?.success
          ? [...result.returnData?.map((item) => ({ type: type, id: item[idKey] })), { type: type, id: type }]
          : [{ type: type, id: type }],
    }),
  }),
  getInvalidationTags: ({ mode, patch }) => {
    const tags = [{ type: type, id: type }];
    if (mode === "save" || mode === "delete") {
      tags.push({ type: type, id: patch.programId });
    }
    return tags;
  },
});

export const {
  useGetFMSProgramsQuery,
  useFindFMSProgramsQuery,
  useLookUpFMSProgramsMutation,
  useDeleteFMSProgramsMutation,
  useSaveFMSProgramsMutation,
  useExportFMSProgramsMutation,
  useListTreeFMSProgramsQuery,
} = fmsProgramsAPI;
