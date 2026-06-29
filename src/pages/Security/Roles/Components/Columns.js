import { AvatarIcon } from "@/components/Common/AvatarIcon";
import {
  DateActionColumn,
  LinkWithAvatarColumn,
  StatusBadgeColumn
} from "@/components/Common/GridColumns";
import StaticDropDownActions from "@/components/Common/StaticDropDownActions";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { isMobile } from "react-device-detect";
import {
  CardBody,
  Container,
  Input
} from "reactstrap";

export const getRolesColumns = (handleAction) => {

  const desktopColumns = [
    {
      header: "Name",
      accessorKey: "roleName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <LinkWithAvatarColumn onClick={() => handleAction('update', row.original)} name={row.original.roleName} />
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <div
            onClick={() => handleAction("update", row.original)}
            style={{ cursor: "pointer" }}
          >
            {row.original.description}
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
        return (
          <DateActionColumn actionDate={row.original.modifiedDate} actionBy={row.original.modifiedByName} onClick={() => handleAction('update', row.original)} />
        );
      },
    },
    {
      header: "Status",
      accessorKey: "statusName",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (cell) => (
        <StatusBadgeColumn statusName={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
      )
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <StaticDropDownActions
            customItems={[
              {
                action: "permissions",
                label: "Permission Type",
                icon: "ri-lock-unlock-fill",
              },
            ]}
            accessRights={CORE_ACCESS_RIGHTS.CORE_SECURITY_ROLES}
            handleActions={handleAction}
            data={data}
          />
        );
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Name",
      accessorKey: "roleName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <CardBody onClick={() => handleAction('update', item)}>
            <div className="d-flex align-items-center">
              <AvatarIcon name={item.roleName} />
              <div style={{ cursor: "pointer" }} className="flex-grow-1 ms-3">
                <a >
                  <h5 className="fs-16 mb-1">{item.roleName}</h5>
                </a>
                <div className="d-flex gap-4 mt-2 text-muted">
                  <div>
                    <StatusBadgeColumn statusName={item.statusName} />
                  </div>
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

export const getPermissionsColumns = (handleAction, { togglePermissions }) => {
  const desktopColumns = [
    {
      header: "System",
      accessorKey: "system",
      enableColumnFilter: false,
      enableSorting: true,
      size: 100,
      minSize: 100,
      getInitialSortDirection: () => "asc",
    },
    {
      header: "Catergory",
      accessorKey: "category",
      enableColumnFilter: false,
      enableSorting: true,
      size: 150,
      minSize: 150,
      getInitialSortDirection: () => "asc",
    },
    {
      header: "Permission Type",
      accessorKey: "permissionTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      size: 150,
      minSize: 150,
      getInitialSortDirection: () => "asc",
    },
    {
      header: "Allow Read",
      accessorKey: "allowRead",
      enableColumnFilter: false,
      enableSorting: true,
      size: 100,
      minSize: 100,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <Container style={{ cursor: "pointer" }}>
            <div className="form-check form-switch form-switch-lg form-switch-success mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={row.original.allowRead}
                onChange={() => togglePermissions("allowRead", row.original)}
              />
            </div>
          </Container>
        );
      },
    },
    {
      header: "Allow Write",
      accessorKey: "allowWrite",
      enableColumnFilter: false,
      enableSorting: true,
      size: 100,
      minSize: 100,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <Container style={{ cursor: "pointer" }}>
            <div className="form-check form-switch form-switch-lg form-switch-success mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={row.original.allowWrite}
                onChange={() => togglePermissions("allowWrite", row.original)}
              />
            </div>
          </Container>
        );
      },
    },
    {
      header: "Allow Delete",
      accessorKey: "allowDelete",
      enableColumnFilter: false,
      enableSorting: true,
      size: 100,
      minSize: 100,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        return (
          <Container style={{ cursor: "pointer" }}>
            <div className="form-check form-switch form-switch-lg form-switch-success mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={row.original.allowDelete}
                onChange={() => togglePermissions("allowDelete", row.original)}
              />
            </div>
          </Container>
        );
      },
    },
    {
      header: "Allow All",
      accessorKey: "allowAll",
      enableColumnFilter: false,
      enableSorting: true,
      size: 100,
      minSize: 100,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const { allowRead, allowWrite, allowDelete } = row.original || {};
        const isAllowAll = allowRead && allowWrite && allowDelete;

        return (
          <Container style={{ cursor: "pointer" }}>
            <div className="form-check form-switch form-switch-lg form-switch-success mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={isAllowAll}
                onChange={() => togglePermissions("allowAll", row.original)}
              />
            </div>
          </Container>
        );
      },
    },
  ];

  const mobileColumns = [
    {
      header: "Permission Type",
      accessorKey: "permissionTypeName",
      enableColumnFilter: false,
      enableSorting: true,
      getInitialSortDirection: () => "asc",
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <>
            <div>{branch.permissionTypeName}</div>
          </>
        );
      },
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
