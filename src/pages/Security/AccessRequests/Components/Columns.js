import { isMobile } from "react-device-detect";

import { Badge } from "@/components/Common/Badge";
import {
  DateActionColumn,
  LinkColumn,
  ReferenceNoColumn,
  TextColumn,
  LinkWithAvatarColumn 
} from "@/components/Common/GridColumns";
import { EmailLink } from '@/components/Common/EmailLink';
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";

export const getAccessRequestColumns = (handleActions) => {
  const desktopColumns = [
    {
      header: "Reference No.",
      accessorKey: "referenceNo",
      enableColumnFilter: false,
      size: 170,
      minSize: 170,
      maxSize: 170,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <ReferenceNoColumn text={transaction.referenceNo} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
        );
      },
    },
    {
      header: "User",
      accessorKey: "firstName",
      enableColumnFilter: false,
      enableSorting: true,
      size: 200,
      minSize: 200,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}>
            <LinkWithAvatarColumn name={transaction.fullName} subName={transaction.userName} />
          </div>
        );
      },
    },
    {
      header: "Contact Info",
      accessorKey: "emailAddress",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <>
            <EmailLink email={transaction.emailAddress} />
            <div style={{ cursor: "pointer" }} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}>
              {transaction.mobileNo ?
                <p>
                  <i className="ri-phone-line text-muted" />{" "}
                  <span>{transaction.mobileNo}</span>
                </p>
                : null
              }
            </div>
          </>
        );
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      enableColumnFilter: false,
      size: 300,
      minSize: 300,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div style={{ cursor: "pointer" }}
            onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}>
            {transaction.remarks}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      maxSize: 100,
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
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DateActionColumn actionDate={transaction.modifiedDate} actionBy={transaction.modifiedByName} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
        );
      },
    },

    {
      header: "Actions",
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
          <LinkColumn onClick={() => handleActions("view", data)} name={data.referenceNo} />
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
