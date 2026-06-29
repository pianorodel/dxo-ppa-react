import { isMobile } from "react-device-detect";

import { DateActionColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getTransactionTypesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Transaction Type Name",
      accessorKey: "transactionTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.transactionTypeName} />;
      },
    },
    {
      header: "Parent Name",
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
      cell: ({ row }) => {
        const data = row.original;
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_TRANSACTIONTYPES} handleActions={handleAction} data={data} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Transaction Type Name",
      accessorKey: "transactionTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <>
            <TextColumn onClick={() => handleAction("update", data)} text={data.transactionTypeName} />
            <DateActionColumn actionDate={data.modifiedDate} actionBy={data.modifiedByName} />
            <div className="align-right">
              <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_TRANSACTIONTYPES} handleActions={handleAction} data={data} />
            </div>
          </>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
