import { FileText } from "lucide-react";
import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { AmountColumn, LinkWithAvatarColumn, ReferenceNoColumn, TextColumn } from "@/components/Common/GridColumns";

export const getTransactionInboxesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Reference No.",
      accessorKey: "refNumber",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <ReferenceNoColumn onClick={() => handleAction("update", row.original)} text={row.original.refNumber} />;
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      enableColumnFilter: false,
      enableSorting: true,
      size: 90,
      minSize: 90,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <div>{row?.original.date}</div>;
      },
    },
    {
      header: "Particulars",
      accessorKey: "particulars",
      enableColumnFilter: false,
      enableSorting: true,
      size: 200,
      minSize: 200,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn text={row.original.particulars} />;
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      enableColumnFilter: false,
      enableSorting: true,
      size: 90,
      minSize: 90,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <AmountColumn amount={row.original.amount} />;
      },
    },
    {
      header: "Fund",
      accessorKey: "fund",
      enableColumnFilter: false,
      enableSorting: true,
      size: 90,
      minSize: 90,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn text={row.original.fund} />;
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      enableColumnFilter: false,
      enableSorting: true,
      size: 90,
      minSize: 90,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn text={row.original.remarks} />;
      },
    },
    {
      header: "Template Code",
      accessorKey: "templateCode",
      enableColumnFilter: false,
      enableSorting: true,
      size: 90,
      minSize: 90,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn text={row.original.templateCode} />;
      },
    },
    {
      header: "Actions",
      accessorKey: "action",
      enableSorting: false,
      size: 90,
      minSize: 90,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="text-center">
            <button className="btn btn-success btn-sm" onClick={() => handleAction("jev", data)}>
              <FileText size={16} className="me-1" />
              Prepare JEV
            </button>
          </div>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Ref Number",
      accessorKey: "refNumber",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <LinkWithAvatarColumn name={item.refNumber} />
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
