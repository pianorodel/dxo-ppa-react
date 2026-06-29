import { isMobile } from "react-device-detect";

import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { EmailLink } from "@/components/Common/EmailLink";
import { DateActionColumn, LinkWithAvatarColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getClientsColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Client",
      accessorKey: "clientCode",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => handleAction("update", row.original)}>
            <div className="flex-shrink-0 me-3">
              <AvatarIcon name={row.original.clientName} avatarImg={client?.avatar} />
            </div>
            <div className="flex-grow-1">
              <h5 className="fs-13 mb-1">
                <div> {row.original.clientName}</div>
              </h5>
              <p className="mb-0">
                <span className="text-muted">Code:</span>
                <span> {row.original.clientCode}</span>
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Client Type",
      accessorKey: "clientTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <div onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
            {row.original.clientTypeName}
          </div>
        );
      },
    },
    {
      header: "TIN",
      accessorKey: "tin",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <div onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
            {row.original.tin}
          </div>
        );
      },
    },
    {
      header: "Contact Person",
      accessorKey: "contactPerson",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <>
            <div onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
              <div>{client.contactPerson}</div>
              <EmailLink email={client.emailAddress} />
              {client.mobileNo ? (
                <p>
                  <i className="ri-phone-line text-muted" /> <span>{client.mobileNo}</span>
                </p>
              ) : null}
            </div>
          </>
        );
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <div onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
            {row.original.remarks}
          </div>
        );
      },
    },
    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return <DateActionColumn actionDate={item.modifiedDate} actionBy={item.modifiedByName} onClick={() => handleAction("update", item)} />;
      },
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const data = row.original;
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_CLIENTS} handleActions={handleAction} data={data} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Client",
      accessorKey: "client",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <>
            <LinkWithAvatarColumn onClick={() => handleAction("update", data)} name={data.clientName} />
            <DateActionColumn actionDate={data.modifiedDate} actionBy={data.modifiedByName} />
            <div className="align-right">
              <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_CLIENTS} handleActions={handleAction} data={data} />
            </div>
          </>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
