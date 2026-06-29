import { isMobile } from "react-device-detect";

import { Badge } from "@/components/Common/Badge";
import {
  AmountColumn,
  ClipboardTextColumn,
  DateActionColumn,
  DateColumn,
  ReferenceNoColumn,
  TextColumn
} from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";

export const getCheckDisbursementColumns = (handleActions) => {
  const desktopColumns = [
    {
      header: "Reference No.",
      accessorKey: "referenceNo",
      enableColumnFilter: false,
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
      header: "Check No.",
      accessorKey: "checkNo",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const t = row.original;
        return <ClipboardTextColumn text={t.checkNo} onClick={() => handleActions(t.actions.edit || t.actions.save ? "update" : "viewDetails", t)} />;
      },
    },
    {
      header: "Payee",
      accessorKey: "payee",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const t = row.original;
        return <TextColumn text={t.payee} onClick={() => handleActions(t.actions.edit || t.actions.save ? "update" : "viewDetails", t)} />;
      },
    },
    {
      header: "Check Label",
      accessorKey: "checkLabel",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const t = row.original;
        return <TextColumn text={t.checkLabel} />;
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const t = row.original;
        return <AmountColumn amount={t.amount} onClick={() => handleActions(t.actions.edit || t.actions.save ? "update" : "viewDetails", t)} />;
      },
    },
    {
      header: "Check Date",
      accessorKey: "checkDate",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const t = row.original;
        return <DateColumn value={t.checkDate} onClick={() => handleActions(t.actions.edit || t.actions.save ? "update" : "viewDetails", t)} />;
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const t = row.original;
        return <TextColumn text={t.remarks} />;
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
        return <div>

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
              <small className="text-muted">Check No.:</small> &nbsp;
              <small> <TextColumn text={data.checkNo} /></small>
            </div>

            <div className="d-flex align-items-center">
              <small className="text-muted">Payee:</small> &nbsp;
              <small> <TextColumn text={data.payee} /></small>
            </div>
            <div className="d-flex align-items-center">
              <small className="text-muted">Check Label:</small> &nbsp;
              <small> <TextColumn text={data.checkLabel} /></small>
            </div>

            <div className="d-flex align-items-center">
              <small className="text-muted">Amount:</small> &nbsp;
              <small> <AmountColumn amount={data.amount} /></small>
            </div>


            <div className="d-flex align-items-center">
              <small className="text-muted">Date Check:</small> &nbsp;
              <small> <AmountColumn amount={data.checkDate} /></small>
            </div>

            <div className="d-flex align-items-center w-100 justify-content-end">
              <small> <Badge color={data.statusColor} value={data.statusName} /></small>
            </div>
          </div>
        </div>;
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
