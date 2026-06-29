import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

const type = "GENERAL_LEDGERS";

export const generalLedgersAPI = createStaticResourceAPI({
  baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/generalLedgers`,
  resource: "GeneralLedgers",
  idKey: "generalLedgerId",
  tagTypes: ["Settings", "GeneralLedgers"],
  lookupMap: (data) => ({
    ...data,
    value: data?.generalLedgerId,
    label: data?.accountTitle,
  }),
  customQuery: (query, { idKey }) => ({
    listTreeGeneralLedgers: query(`${process.env.REACT_APP_FMS_API}/staticdata/generalLedgers/listTree`, {
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
      tags.push({ type: type, id: patch.generalLedgerId });
    }
    return tags;
  },
});

export const {
  useGetGeneralLedgersQuery,
  useFindGeneralLedgersQuery,
  useLookUpGeneralLedgersMutation,
  useDeleteGeneralLedgersMutation,
  useSaveGeneralLedgersMutation,
  useExportGeneralLedgersMutation,
  useListTreeGeneralLedgersQuery,
} = generalLedgersAPI;
