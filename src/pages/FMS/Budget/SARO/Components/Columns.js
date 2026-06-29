import { AmountColumn, DateTimeColumn, LinkWithAvatarColumn, ReferenceNoColumn, TextColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

export const getSAROsColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "SARO No.",
            accessorKey: "saroNo",
            enableColumnFilter: false,
            enableSorting: true,
            size: 300,
            minSize: 300,
            enableResizing: false,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <ReferenceNoColumn onClick={() => handleAction('update', row.original)} text={row.original.saroNo} />
                );
            },
        },

        {
            header: "Amount",
            accessorKey: "amount",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            size: 30,
            minSize: 30,
            cell: ({ row }) => {
                return (
                    <AmountColumn amount={row.original.amount} onClick={() => handleAction('update', row.original)} />
                );
            },
        },
        {
            header: "Department",
            accessorKey: "department",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Agency",
            accessorKey: "agency",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Operating Unit",
            accessorKey: "operatingUnit",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Purpose",
            accessorKey: "purpose",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Released Date",
            accessorKey: "releasedDate",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: (cell) => (
                <DateTimeColumn value={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_BUDGET_SAROS} handleActions={handleAction} data={data} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "saroNo",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.saroNo} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
