import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

import { DateActionColumn, LinkWithAvatarColumn, TextColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getFundSubCategoriesColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "Fund Cluster",
            accessorKey: "fundClusterName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const data = row.original
                return (
                    <TextColumn text={data.fundClusterName} onClick={() => handleAction('update', data)} />
                );
            },
        },
        {
            header: "Financing Source",
            accessorKey: "financingSourceName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const data = row.original
                return (
                    <TextColumn text={data.financingSourceName} onClick={() => handleAction('update', data)} />
                );
            },
        },
        {
            header: "Authorization",
            accessorKey: "authorizationCodeName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const data = row.original
                return (
                    <TextColumn text={data.authorizationCodeName} onClick={() => handleAction('update', data)} />
                );
            },
        },
        {
            header: "Fund Category",
            accessorKey: "fundCategoryName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <TextColumn onClick={() => handleAction('update', row.original)} text={row.original.fundCategoryName} />
                );
            },
        },
        {
            header: "Fund Sub Category",
            accessorKey: "fundSubCategoryName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <TextColumn onClick={() => handleAction('update', row.original)} text={row.original.fundSubCategoryName} />
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
                    <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_FUNDSUBCATEGORIES} handleActions={handleAction} data={item} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "fundSubCategoryName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.fundSubCategoryName} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
