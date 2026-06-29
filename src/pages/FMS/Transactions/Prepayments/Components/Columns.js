import { isMobile } from "react-device-detect";

import { Badge } from "@/components/Common/Badge";
import { AmountColumn, DateActionColumn, DateRangeColumn, ReferenceNoColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";

export const getPrepaymentColumns = (handleActions) => {
  const desktopColumns = [
    {
      header: "Reference No.",
      accessorKey: "referenceNo",
      enableColumnFilter: false,
      size: 140,
      minSize: 140,
      maxSize: 140,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <ReferenceNoColumn
            text={transaction.referenceNo}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Payee",
      accessorKey: "payeeName",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <TextColumn
            text={transaction.payeeName}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Prepaid Type",
      accessorKey: "prepaidTypeName",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <TextColumn
            text={transaction.prepaidTypeName}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Period",
      accessorKey: "startDate",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DateRangeColumn
            startDate={transaction.startDate}
            endDate={transaction.endDate}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Total Amount",
      accessorKey: "totalPrepaidAmount",
      enableColumnFilter: false,
      size: 70,
      minSize: 70,
      maxSize: 70,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <AmountColumn
            amount={transaction.totalPrepaidAmount}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "No. of Months",
      accessorKey: "totalMonths",
      enableColumnFilter: false,
      size: 70,
      minSize: 70,
      maxSize: 70,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <TextColumn
            text={String(transaction.totalMonths)}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
        );
      },
    },
    {
      header: "Monthly",
      accessorKey: "monthlyAmortization",
      enableColumnFilter: false,
      size: 70,
      minSize: 70,
      maxSize: 70,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <AmountColumn
            amount={transaction.monthlyAmortization}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
          />
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
          <Badge color={transaction.statusColor} value={transaction.statusName} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
        );
      },
    },

    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      size: 140,
      minSize: 140,
      maxSize: 140,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DateActionColumn actionDate={transaction.modifiedDate} actionBy={transaction.modifiedByName} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
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
    }
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
          <div>
            <div className="d-flex align-items-center justify-content-between">
              {" "}
              <ReferenceNoColumn
                text={data.referenceNo}
                onClick={() => handleActions(data.actions.edit || data.actions.save ? "update" : "viewDetails", data)}
              />{" "}
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
              />{" "}
            </div>
            <div onClick={() => handleActions(data.actions.edit || data.actions.save ? "update" : "viewDetails", data)}>
              <div className="d-flex align-items-center w-100 justify-content-end">
                <small>
                  {" "}
                  <Badge color={data.statusColor} value={data.statusName} />
                </small>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
