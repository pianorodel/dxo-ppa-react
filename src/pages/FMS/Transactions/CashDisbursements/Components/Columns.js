import { isMobile } from "react-device-detect";

import { Badge } from "@/components/Common/Badge";
import { AmountColumn, DateActionColumn, ReferenceNoColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";

export const getCashDisbursementColumns = (handleActions) => {
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
      header: "Payee",
      accessorKey: "payee",
      enableColumnFilter: false,
      size: 150,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <TextColumn text={transaction.payee} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      enableColumnFilter: false,
      size: 60,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <AmountColumn amount={transaction.amount} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
        );
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      enableColumnFilter: false,
      size: 150,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <TextColumn text={transaction.remarks} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
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
        header: "Information",
      accessorKey: "referenceNo",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div >
            <div className="d-flex align-items-center justify-content-between">  <ReferenceNoColumn text={data.referenceNo} onClick={() => handleActions(data.actions.edit || data.actions.save ? "update" : "viewDetails", data)} />   <StaticDropDownActions
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
            /> </div>
            <div onClick={() => handleActions(data.actions.edit || data.actions.save ? "update" : "viewDetails", data)}>
              <div className="d-flex align-items-center">
                <small className="text-muted">Amount:</small> &nbsp;
                <small> <AmountColumn amount={data.amount} /></small>
              </div>

              <div className="d-flex align-items-center">
                <small className="text-muted">Payee:</small> &nbsp;
                <small> <TextColumn text={data.payee} /></small>
              </div>
              <div className="d-flex align-items-center">
                <small className="text-muted">Status:</small> &nbsp;
                <small> <Badge color={data.statusColor} value={data.statusName} /></small>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
