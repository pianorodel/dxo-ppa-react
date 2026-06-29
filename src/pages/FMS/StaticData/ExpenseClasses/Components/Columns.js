import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

import { DateActionColumn, LinkWithAvatarColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getExpenseClassesColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "Name",
            accessorKey: "expenseClassName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <LinkWithAvatarColumn onClick={() => handleAction('update', row.original)} name={row.original.expenseClassName} />
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
                const item = row.original
                return (
                    <DateActionColumn actionDate={item.modifiedDate} actionBy={item.modifiedByName} onClick={() => handleAction('update', item)} />
                );
            },
        },
        {
            header: "Actions",
            enableSorting: false,
            size: 50,
            minSize: 50,
            maxSize: 50,
            cell: ({ row }) => {
                const item = row.original
                return (
                    <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_EXPENSECLASSES} handleActions={handleAction} data={item} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "expenseClassName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.expenseClassName} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
