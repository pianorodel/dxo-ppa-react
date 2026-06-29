import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

export const getBURsColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "Year",
            accessorKey: "year",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Legal Basis",
            accessorKey: "legalBasis",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Type",
            accessorKey: "type",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell) => (
                <TextColumn text={cell.getValue()} onClick={() => handleAction('update', cell.row.original)} />
            ),
        },
        {
            header: "Last Update",
            accessorKey: "modifiedDate",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <DateActionColumn actionDate={item.modifiedDate} actionBy={item.modifiedByName} onClick={() => handleAction('update', item)} />
                );
            },
        },
        {
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const data = row.original
                return (
                    <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_BUDGET_BURS} handleActions={handleAction} data={data} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "displayName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.displayName} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
