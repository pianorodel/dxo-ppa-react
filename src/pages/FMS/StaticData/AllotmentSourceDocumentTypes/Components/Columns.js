import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getAllotmentSourceDocumentTypesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Code",
      accessorKey: "code",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.code} />;
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.name} />;
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.category} />;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.description} />;
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
        const item = row.original;
        return (
          <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_ALLOTMENTSOURCEDOCUMENTTYPES} handleActions={handleAction} data={item} />
        );
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "allotmentSourceDocumentTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <LinkWithAvatarColumn name={item.allotmentSourceDocumentTypeName} />
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
