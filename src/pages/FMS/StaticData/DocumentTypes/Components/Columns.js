import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { DateActionColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getDocumentTypesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Code",
      accessorKey: "documentTypeCode",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.documentTypeCode} />;
      },
    },
    {
      header: "Name",
      accessorKey: "documentTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.documentTypeName} />;
      },
    },
    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return <DateActionColumn actionDate={item.modifiedDate} actionBy={item.modifiedByName} onClick={() => handleAction("update", item)} />;
      },
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const data = row.original;
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_DOCUMENTTYPES} handleActions={handleAction} data={data} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "documentTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <TextColumn text={item.documentTypeName} />
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
