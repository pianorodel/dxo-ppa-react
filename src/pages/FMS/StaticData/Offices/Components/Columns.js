import { isMobile } from "react-device-detect";

import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getOfficesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Code",
      accessorKey: "officeCode",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      size: 80,
      minSize: 80,
      maxSize: 80,
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.officeCode} />;
      },
    },
    {
      header: "Name",
      accessorKey: "officeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.officeName} />;
      },
    },
    {
      header: "Parent",
      accessorKey: "parentName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <div>{row.original.parentName}</div>;
      },
    },
    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: (cell) => <DateActionColumn actionDate={cell.getValue()} actionBy={cell.row.original.modifiedByName} />,
    },
    {
      header: "Actions",
      enableSorting: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      cell: ({ row }) => {
        const data = row.original;
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_RESPONSIBILITYCENTERS} handleActions={handleAction} data={data} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Responsibility Center Name",
      accessorKey: "officeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <>
            <LinkWithAvatarColumn onClick={() => handleAction("update", data)} name={data.officeName} />
            <DateActionColumn actionDate={data.modifiedDate} actionBy={data.modifiedByName} />
            <div className="align-right">
              <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_RESPONSIBILITYCENTERS} handleActions={handleAction} data={data} />
            </div>
          </>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
