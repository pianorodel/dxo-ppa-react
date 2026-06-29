import createStaticResourceAPI from "@/helpers/rtk_static_resource_factory";

export const clientsAPI = createStaticResourceAPI({
  baseURL: `${process.env.REACT_APP_FMS_API}/staticdata/clients`,
  resource: "Clients",
  idKey: "clientId",
  tagTypes: ["Settings", "clients"],
  lookupMap: (data) => ({
    ...data,
    value: data?.clientId,
    label: data?.clientName,
  }),
});

export const {
  useGetClientsQuery,
  useFindClientsQuery,
  useLookUpClientsMutation,
  useDeleteClientsMutation,
  useSaveClientsMutation,
  useExportClientsMutation,
} = clientsAPI;
