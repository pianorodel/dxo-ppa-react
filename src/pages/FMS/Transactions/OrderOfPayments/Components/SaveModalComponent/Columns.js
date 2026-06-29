import { isMobile } from "react-device-detect";

import { AmountColumn, UpdateAndDeleteColumn } from "@/components/Common/GridColumns";

export const getAddItemColumns = (handleActions, isSHowAction = true) => {
  const desktopColumns = [
    {
      header: "Transaction Type",
      accessorKey: "transactionTypeName",
      enableColumnFilter: false,
      size: 250,
      minSize: 250,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              isSHowAction ? handleActions(e, "update", transaction)
                : ''}
          >
            <div>
              {transaction?.transactionTypeName}
            </div>
          </div>
        );
      },
    },

    {
      header: "Description",
      accessorKey: "description",
      enableColumnFilter: false,
      size: 250,
      minSize: 250,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              isSHowAction ? handleActions(e, "update", transaction)
                : ''}
          >
            {transaction?.description}
          </div>
        );
      },
    },

    {
      header: "Quantity",
      accessorKey: "quantity",
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              isSHowAction ? handleActions(e, "update", transaction)
                : ''}
          >
            <div>
              {transaction?.quantity}
            </div>
          </div>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "amount",
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <center
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              isSHowAction ? handleActions(e, "update", transaction)
                : ''}>
            <AmountColumn amount={transaction?.amount} />
          </center>
        );
      },
    },
    ...(isSHowAction
      ? [
        {
          header: "Actions",
          cell: ({ row }) => {
            const data = row.original;
            return (
              <UpdateAndDeleteColumn
                handleUpdate={(e) => isSHowAction ? handleActions(e, "update", data)
                  : ''}
                handleDelete={(e) => isSHowAction ? handleActions(e, "delete", data) : ''}
              />
            );
          },
        },
      ]
      : []),
  ];

  const mobileColumns = [
    {
      header: "Transaction Type",
      accessorKey: "transactionTypeName",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (

          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              isSHowAction ? handleActions(e, "update", transaction)
                : ''
            }
          >
            <div>
              {transaction?.transactionTypeName}
            </div>
          </div>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};

export const getItemsViewColumn = () => {
  const desktopColumns = [
    {
      header: "Transaction Type",
      accessorKey: "transactionTypeName",
      enableColumnFilter: false,
      size: 250,
      minSize: 250,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div>
            <div>
              {transaction?.transactionTypeName}
            </div>
          </div>
        );
      },
    },

    {
      header: "Description",
      accessorKey: "description",
      enableColumnFilter: false,
      size: 250,
      minSize: 250,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div>
            {transaction?.description}
          </div>
        );
      },
    },

    {
      header: "Quantity",
      accessorKey: "quantity",
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div>
            <div>
              {transaction?.quantity}
            </div>
          </div>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "amount",
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <center>
            <AmountColumn amount={transaction?.amount} />
          </center>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Transaction Type",
      accessorKey: "transactionTypeName",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div>
            <div>
              {transaction?.transactionTypeName}
            </div>
          </div>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};