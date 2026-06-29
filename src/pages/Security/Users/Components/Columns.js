import { isMobile } from "react-device-detect";
import { CardBody } from "reactstrap";

import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { Badge } from "@/components/Common/Badge";
import { EmailLink } from "@/components/Common/EmailLink";
import {
  DateActionColumn,
  DateTimeColumn,
  StatusBadgeColumn,
  TwoLinesColumn
} from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getUsersColumns = (handleAction) => {
  const desktopColumns = [
    {
      header: "User",
      accessorKey: "firstName",
      enableColumnFilter: false,
      enableSorting: true,
      size: 200,
      minSize: 200,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => (
        <div className="d-flex align-items-center" onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
          <AvatarIcon name={row.original.fullName} avatarImg={row.original.avatar} />
          <div className="flex-grow-1">
            <div className="fs-13 ">
              {" "}
              {row.original.fullName}
            </div>
            <Badge value={row.original.userTypeName} color={row.original.userTypeColor} />
          </div>
        </div>
      ),
    },
    {
      header: "Login ID",
      accessorKey: "userName",
      enableColumnFilter: false,
      enableSorting: true,
      size: 150,
      minSize: 150,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => (
        <div className="cursor-pointer" onClick={() => handleAction("update", row.original)} style={{ fontSize: "14px" }}>
          {row.original.employeeId > 0 ? <i className="ri-admin-fill text-success" title={`Employee No.: ${row.original.employeeNo || ""}`} /> : ""}{" "}
          {row.original.userName}
        </div>
      ),
    },
    {
      header: "Department / Position",
      accessorKey: "position",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => (
        <TwoLinesColumn line1={row.original.officeName} line2={row.original.position} onClick={() => handleAction("update", row.original)} />
      ),
    },
    {
      header: "Contact Info",
      accessorKey: "emailAddress",
      enableColumnFilter: false,
      enableSorting: true,
      size: 150,
      minSize: 150,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => (
        <>
          <EmailLink email={row.original.emailAddress} />
          <div onClick={() => handleAction("update", row.original)} style={{ cursor: "pointer" }}>
            {row.original.mobileNo ? (
              <p>
                <i className="ri-phone-line text-muted" /> <span>{row.original.mobileNo}</span>
              </p>
            ) : null}
          </div>
        </>
      ),
    },
    {
      header: "Roles",
      accessorKey: "roles",
      enableColumnFilter: false,
      enableSorting: false,
      size: 200,
      minSize: 200,
      cell: ({ getValue }) => {
        const roles = getValue();
        return (
          <>
            {roles.map((role, index) => (
              <span key={index}>
                <Badge value={role.roleName} color="info"/>
                {"  "}
              </span>
            ))}
          </>
        );
      },
    },
    {
      header: "Last Activity",
      accessorKey: "lastLoginDate",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => <DateTimeColumn value={row.original.lastLoginDate} onClick={() => handleAction("update", row.original)} />,
    },
    {
      header: "Status",
      accessorKey: "statusName",
      enableColumnFilter: false,
      enableSorting: false,
      size: 80,
      minSize: 80,
      getInitialSortDirection: () => "asc",
      cell: (cell) => (
        <>
          <StatusBadgeColumn statusName={cell.getValue()} onClick={() => handleAction("update", cell.row.original)} />
          <br />
          {cell.row.original.onlineStatus?.trim() && (
            <>
              <StatusBadgeColumn statusName={cell.row.original.onlineStatus} onClick={() => handleAction("update", cell.row.original)} />
              <br />
            </>
          )}
          <StatusBadgeColumn statusName={cell.row.original.lockStatus} onClick={() => handleAction("update", cell.row.original)} />
        </>
      ),
    },
    {
      header: "Last Update",
      accessorKey: "modifiedDate",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => (
        <DateActionColumn
          actionDate={row.original.modifiedDate}
          actionBy={row.original.modifiedByName}
          onClick={() => handleAction("update", row.original)}
        />
      ),
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <StaticDropDownActions
            accessRights={CORE_ACCESS_RIGHTS.CORE_SECURITY_USERS}
            handleActions={handleAction}
            data={data}
            customItems={[
              !data?.employeeId && { action: "createEmployee", label: "Create Employee Record", icon: "ri-user-add-line" },
              !data?.employeeId && { action: "linkEmployee", label: "Link to Employee Record", icon: "ri-links-line" },
            ].filter(Boolean)}
          />
        );
      },
    },
  ];

  const mobileColumns = [
    {
      header: "User",
      accessorKey: "userName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <CardBody onClick={() => handleAction("update", user)}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <div className="avatar-lg rounded">
                    <img
                      src={process.env.REACT_APP_S3 + user.avatar}
                      alt={user.fullName}
                      className="member-img img-fluid d-block rounded"
                      style={{ height: "96px", width: "96px", objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="avatar-lg rounded">
                    <div className="avatar-title border bg-light text-primary rounded text-uppercase fs-24">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ cursor: "pointer" }} className="flex-grow-1 ms-3">
                <a>
                  <h5 className="fs-16 mb-1">{user.fullName}</h5>
                </a>
                <p className="text-muted mb-2">{user.userName}</p>
                <div className="d-flex gap-4 mt-2 text-muted">
                  <StatusBadgeColumn statusName={user.statusName} />
                </div>
                <div className="d-flex gap-4 mt-2 text-muted">
                  {user.roles.map((role, index) => (
                    <span key={index} className="badge bg-info-subtle text-info">
                      {role.roleName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
