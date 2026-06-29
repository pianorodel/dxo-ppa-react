import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getProgramsColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "Name",
            accessorKey: "programName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <TextColumn onClick={() => handleAction('update', row.original)} text={row.original.programName} />
                );
            },
        },
        {
            header: "Type",
            accessorKey: "programTypeName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <TextColumn onClick={() => handleAction('update', row.original)} text={row.original.programTypeName} />
                );
            },
        },
        {
            header: "Parent",
            accessorKey: "parentName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <TextColumn onClick={() => handleAction('update', row.original)} text={row.original.parentName} />
                );
            },
        },
        {
            header: "UACS",
            accessorKey: "uacs",
            enableColumnFilter: false,
            enableSorting: true,
            size: 50,
            minSize: 50,
            maxSize: 50,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <TextColumn onClick={() => handleAction('update', row.original)} text={row.original.uacs} />
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
                    <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_PROGRAMS} handleActions={handleAction} data={item} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "programName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.programName} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
