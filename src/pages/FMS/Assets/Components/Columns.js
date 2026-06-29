import { isMobile } from 'react-device-detect';
import { CardBody } from 'reactstrap';

import { DateActionColumn, LinkWithAvatarColumn } from '@/components/Common/GridColumns';
import StaticDropDownActions from '@/components/Common/StaticDropDownActions';
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export const getAssetsColumns = (handleAction) => {

    const desktopColumns = [
        {
            header: "Asset No.",
            accessorKey: "assetNo",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                return (
                    <LinkWithAvatarColumn onClick={() => handleAction('update', row.original)} name={row.original.assetName} />
                );
            },
        },
        {
            header: "Description",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Type",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Acquisition Date",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Asset Cost",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Accum. Depr.",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Book Value",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Useful Life",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Monthly Depr.",
            accessorKey: "description",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <TextColumn
                        text={transaction.Description}
                        onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)}
                    />
                );
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            enableColumnFilter: false,
            size: 50,
            minSize: 50,
            maxSize: 50,
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <Badge color={transaction.statusColor} value={transaction.statusName} onClick={() => handleActions(transaction.actions.edit || transaction.actions.save ? "update" : "viewDetails", transaction)} />
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
                    <StaticDropDownActions accessRights={FMS_ACCESS_RIGHTS.FMS_ASSET_ASSETS} handleActions={handleAction} data={item} />
                );
            },
        },
    ];

    const mobileColumns = [
        {
            header: "Name",
            accessorKey: "assetName",
            enableColumnFilter: false,
            enableSorting: true,
            getInitialSortDirection: () => "asc",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <CardBody onClick={() => handleAction('update', item)}>
                        <LinkWithAvatarColumn name={item.assetName} />
                    </CardBody>
                );
            },
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};
