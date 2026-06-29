import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

import { DateActionColumn, LinkWithAvatarColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getProvincesColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "Name",
            accessorKey: "provinceName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <LinkWithAvatarColumn onClick={() => handleAction('update', row.original)} name={row.original.provinceName} />
                );
            },
        },
        {
            header: "Last Update",
            accessorKey: "modifiedDate",
            enableColumnFilter: false,
            enableSorting: true,
            size: 150,
            minSize: 150,
            maxSize: 150,
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
                    <StaticDropDownActions accessRights={ACCESSCORE_ACCESS_RIGHTS_RIGHTS.CORE_STATICDATA_PROVINCES} handleActions={handleAction} data={item} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "provinceName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.provinceName} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
