import { isMobile } from "react-device-detect";

import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getGeneralLedgersColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Account Code",
      accessorKey: "accountCode",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.accountCode} />;
      },
    },
    {
      header: "Account Title",
      accessorKey: "accountTitle",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.accountTitle} />;
      },
    },
    {
      header: "Account Classification",
      accessorKey: "accountClassificationName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.accountClassificationName} />;
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
      cell: ({ row }) => {
        const data = row.original;
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_GENERALLEDGERS} handleActions={handleAction} data={data} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Account Title",
      accessorKey: "accountTitle",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <>
            <LinkWithAvatarColumn onClick={() => handleAction("update", data)} name={data.accountTitle} />
            <DateActionColumn actionDate={data.modifiedDate} actionBy={data.modifiedByName} />
            <div className="align-right">
              <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_GENERALLEDGERS} handleActions={handleAction} data={data} />
            </div>
          </>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
