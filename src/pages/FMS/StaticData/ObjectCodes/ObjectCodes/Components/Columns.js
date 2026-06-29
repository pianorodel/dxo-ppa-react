import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { ClipboardTextColumn, DateActionColumn, LinkWithAvatarColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { max } from "lodash";

export const getObjectCodesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Object Code",
      accessorKey: "objectCodeName",
      enableColumnFilter: false,
      enableSorting: true,
      size: 200,
      minSize: 200,
      maxSize: 200,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.objectCodeName} />;
      },
    },
    {
      header: "Parent UACS",
      accessorKey: "classification",
      enableColumnFilter: false,
      enableSorting: true,
      size: 250,
      minSize: 250,
      maxSize: 250,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.parentUACS} />;
      },
    },
    {
      header: "UACS",
      accessorKey: "uacs",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      size: 50,
      minSize: 50,
      maxSize: 50,
      cell: ({ row }) => {
        return <ClipboardTextColumn onClick={() => handleAction("update", row.original)} text={row.original.uacs} />;
      },
    },
    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      enableSorting: true,
      size: 120,
      minSize: 120,
      maxSize: 120,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return <DateActionColumn actionDate={item.modifiedDate} actionBy={item.modifiedByName} onClick={() => handleAction("update", item)} />;
      },
    },
    {
      header: "Actions",
      enableSorting: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      cell: ({ row }) => {
        const item = row.original;
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_OBJECTCODES} handleActions={handleAction} data={item} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "objectCodeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <LinkWithAvatarColumn name={item.objectCodeName} />
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
