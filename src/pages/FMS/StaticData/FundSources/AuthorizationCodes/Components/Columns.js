import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getAuthorizationCodesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Name",
      accessorKey: "authorizationCodeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.authorizationCodeName} />;
      },
    },
    {
      header: "Financing Source",
      accessorKey: "financingSourceName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.financingSourceName} />;
      },
    },
    {
      header: "UACS",
      accessorKey: "uacs",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.uacs} />;
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
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_AUTHORIZATIONCODES} handleActions={handleAction} data={item} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "authorizationCodeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <LinkWithAvatarColumn name={item.authorizationCodeName} />
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
