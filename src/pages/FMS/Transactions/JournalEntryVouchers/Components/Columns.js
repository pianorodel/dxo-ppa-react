import { isMobile } from "react-device-detect";

import { Badge } from "@/components/Common/Badge";
import {
  DateActionColumn,
  LinkColumn,
  ReferenceNoColumn,
} from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";

export const getJournalEntryVoucherColumns = (handleActions) => {
  const desktopColumns = [
    {
      header: "Reference No.",
      accessorKey: "referenceNo",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <ReferenceNoColumn text={transaction.referenceNo} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
        );
      },
    },

    {
      header: "Status",
      accessorKey: "status",
      enableColumnFilter: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Badge
            color={transaction.statusColor}
            value={transaction.statusName}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      size: 120,
      minSize: 120,
      maxSize: 120,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DateActionColumn
            actionDate={transaction.modifiedDate}
            actionBy={transaction.modifiedByName}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Actions",
      size: 50,
      minSize: 50,
      maxSize: 50,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <StaticDropDownActions
            data={data}
            handleActions={handleActions}
            viewDetails={true}
            isShowEdit={data?.actions?.edit}
            isShowDelete={data?.actions?.delete}
            customItems={[
              ...(data?.actions?.print
                ? [
                  {
                    action: "print",
                    label: "Print",
                    icon: "ri-printer-fill",
                  },
                ]
                : []),
            ]}
          />
        );
      },
    },
  ];

  const mobileColumns = [
    {
      accessorKey: "referenceNo",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <LinkColumn onClick={() => handleActions("view", data)} name={data.referenceNo} />
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
