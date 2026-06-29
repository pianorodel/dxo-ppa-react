import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { EmailLink } from "@/components/Common/EmailLink";
import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getBankBranchesColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "Name",
      accessorKey: "branchName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.branchName} />;
      },
    },
    {
      header: "Code",
      accessorKey: "branchCode",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.branchCode} />;
      },
    },
    {
      header: "Bank",
      accessorKey: "bankName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.bankName} />;
      },
    },
    {
      header: "Contact Info",
      accessorKey: "emailAddress",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <>
            <EmailLink email={data.emailAddress} />
            <div onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
              {data.contactNo ? (
                <p>
                  <i className="ri-phone-line text-muted" /> <span>{data.contactNo}</span>
                </p>
              ) : null}
            </div>
          </>
        );
      },
    },
    {
      header: "Address",
      accessorKey: "address",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return <TextColumn onClick={() => handleAction("update", row.original)} text={row.original.address} />;
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
        return <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKBRANCHES} handleActions={handleAction} data={data} />;
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "branchName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction("update", item)}>
            <LinkWithAvatarColumn name={item.branchName} />
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
