import { isMobile } from "react-device-detect";
import { Badge, CardBody } from "reactstrap";

import { AvatarIcon } from "@/components/Common/AvatarIcon";
import BlockchainIcon from "@/components/Common/BlockchainIcon";
import { DateTimeColumn, LinkWithAvatarColumn, StatusBadgeColumn } from "@/components/Common/GridColumns";

export const getSystemLogsColumns = (handleActions) => {
  const desktopColumns = [
    {
      header: "Log Date",
      accessorKey: "logDate",
      enableColumnFilter: false,
      enableSorting: true,
      size: 150,
      minSize: 150,
      maxSize: 150,
      enableResizing: false,
      getInitialSortDirection: () => "asc",
      cell: (cell) => <DateTimeColumn value={cell.getValue()} />,
    },
    {
      header: "Log By",
      accessorKey: "fullName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const log = row.original;
        return <LinkWithAvatarColumn name={log.fullName} avatar={log?.avatar} onClick={log.userId ? () => handleActions("viewDetails", log) : undefined} />;
      },
    },
    {
      header: "IP Address",
      accessorKey: "ipAddress",
      enableColumnFilter: false,
      enableSorting: true,
      size: 120,
      minSize: 120,
      maxSize: 120,
      enableResizing: false,
      getInitialSortDirection: () => "asc",
    },
    {
      header: "System",
      accessorKey: "system",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ getValue }) => {
        let badgeColor = "info";

        if (getValue() == "DXO-Core") badgeColor = "success";
        else if (getValue() == "FMS") badgeColor = "info";
        else badgeColor = "info";

        return (
          <>
            <Badge color={badgeColor}>{getValue()}</Badge>
          </>
        );
      },
    },
    {
      header: "Title",
      accessorKey: "title",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <>
            <Badge color={row.original.badgeColor || null}>{row.original.title}</Badge>
          </>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      enableColumnFilter: false,
      enableSorting: true,
      size: 300,
      minSize: 300,
      maxSize: 500,
      enableResizing: false,
      getInitialSortDirection: () => "asc",
      cell: (cell) => {
        return (
          <>
            <span dangerouslySetInnerHTML={{ __html: cell.getValue() }} />
            {cell.row.original.remarks && (
              <div className="pt-2">
                <span className="text-muted">Remarks: </span> <span className="text-decoration-italic">{cell.row.original.remarks}</span>
              </div>
            )}
          </>
        );
      },
    },
    {
      header: "",
      accessorKey: "securityHash",
      enableColumnFilter: false,
      enableSorting: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      enableResizing: false,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <BlockchainIcon isValid={!row.original.isBroken} title={row.original.securityHash ?? "No hash"} />
          </div>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      accessorKey: "description",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <div className="d-flex align-items-center">
              <AvatarIcon name={item.fullName} avatarImg={item.avatar} />
              <div style={{ cursor: "pointer" }} className="flex-grow-1 ms-3">
                <h5 className="fs-16 mb-1">{item.fullName}</h5>
                <DateTimeColumn value={item.logDate} />
                <span dangerouslySetInnerHTML={{ __html: item.description }} />
                <div className="d-flex gap-4 mt-2 text-muted">
                  <div>
                    <StatusBadgeColumn statusName={item.system} />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        );
      },

      // cell: ({ row }) => {
      //   const log = row.original;
      //   return (
      //     <>
      //       <LinkWithAvatarColumn name={log.fullName} />
      //       <span dangerouslySetInnerHTML={{ __html: log.description }} />
      //     </>
      //   );
      // },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
