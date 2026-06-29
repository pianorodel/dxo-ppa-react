import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

export function buildFmsMenuItems(state) {
    var isFMSAccounting = state.isFMSAccounting;
    var isFMSBudget = state.isFMSBudget;
    var isFMSCollection = state.isFMSCollection;
    var isFMSDisbursement = state.isFMSDisbursement;
    var setIsFMSAccounting = state.setIsFMSAccounting;
    var setIsFMSBudget = state.setIsFMSBudget;
    var setIsFMSCollection = state.setIsFMSCollection;
    var setIsFMSDisbursement = state.setIsFMSDisbursement;
    var setIscurrentState = state.setIscurrentState;

    return [
        {
            id: "fms-accounting", label: "Accounting", icon: "ri-secure-payment-fill",
            link: "/#", parentId: "fms", isChildItem: true,
            stateVariables: isFMSAccounting,
            click: function (e) { e.preventDefault(); setIsFMSAccounting(!isFMSAccounting); setIscurrentState("FMSAccounting"); },
            childItems: [
                { id: "fms-accounting-transaction-inbox", label: "Transactions Inbox", link: "/fms/accounting/transactioninboxes", permissionTypeId: [] },
                { id: "fms-accounting-jev", label: "Journal Entry Vouchers", link: "/fms/transactions/jev", permissionTypeId: [] },
                { id: "fms-asset-registry", label: "Asset Registry", link: "/fms/assets", permissionTypeId: [] },
                { id: "fms-accounting-depreciation-schedules", label: "Depreciation Schedules", link: "/fms/assets/depreciationschedules", permissionTypeId: [] },
                { id: "fms-accounting-prepayments", label: "Prepayments", link: "/fms/transactions/prepayments", permissionTypeId: [] },
                { id: "fms-accounting-prepayments-amortizations", label: "Amortization Schedules", link: "/fms/transactions/prepayments/amortizations", permissionTypeId: [] },
            ],
        },
        {
            id: "fms-budget", label: "Budget", icon: "ri-money-dollar-circle-line",
            link: "/#", parentId: "fms", isChildItem: true,
            stateVariables: isFMSBudget,
            click: function (e) { e.preventDefault(); setIsFMSBudget(!isFMSBudget); setIscurrentState("FMSBudget"); },
            childItems: [
                { id: "fms-budget-appropriations", label: "Appropriations", link: "/fms/budget/appropriations", permissionTypeId: [] },
                { id: "fms-budget-nca", label: "Notice of Cash Allocations", link: "/fms/budget/nca", permissionTypeId: [] },
                { id: "fms-budget-allotments", label: "Allotments", link: "/fms/budget/allotments", permissionTypeId: [] },
                { id: "fms-budget-obligations", label: "Obligations", link: "/fms/transactions/obligations", permissionTypeId: [] },
                { id: "fms-budget-lddap", label: "LDDAP-ADA", link: "/fms/budget/lddap", permissionTypeId: [] },
            ],
        },
        {
            id: "fms-collection", label: "Collection", icon: "ri-coin-fill",
            link: "/#", parentId: "fms", isChildItem: true,
            stateVariables: isFMSCollection,
            click: function (e) { e.preventDefault(); setIsFMSCollection(!isFMSCollection); setIscurrentState("FMSCollection"); },
            childItems: [
                { id: "fms-collection-oop", label: "Order of Payments", link: "/fms/transactions/orderofpayments", permissionTypeId: [] },
                { id: "fms-collection-collections", label: "Collections", link: "/fms/transactions/collections", permissionTypeId: [] },
                { id: "fms-collection-deposits", label: "Deposits", link: "/fms/transactions/deposits", permissionTypeId: [] },
            ],
        },
        {
            id: "fms-disbursement", label: "Disbursement", icon: "ri-hand-coin-line",
            link: "/#", parentId: "fms", isChildItem: true,
            stateVariables: isFMSDisbursement,
            click: function (e) { e.preventDefault(); setIsFMSDisbursement(!isFMSDisbursement); setIscurrentState("FMSDisbursement"); },
            childItems: [
                { id: "fms-disbursement-vouchers", label: "Disbursement Vouchers", link: "/fms/transactions/disbursementvouchers", permissionTypeId: [] },
                { id: "fms-disbursement-checks", label: "Check Disbursements", link: "/fms/transactions/checkdisbursements", permissionTypeId: [] },
                { id: "fms-disbursement-cash", label: "Cash Disbursements", link: "/fms/transactions/cashdisbursements", permissionTypeId: [] },
                { id: "fms-disbursement-cash-advances", label: "Cash Advances", link: "/fms/transactions/cash-advances", permissionTypeId: [] },
                { id: "fms-disbursement-liquidations", label: "Liquidations", link: "/fms/transactions/liquidations", permissionTypeId: [] },
            ],
        },
        { id: "fms-reports", label: "Reports", icon: "ri-article-line", link: "/fms/reports", parentId: "fms", permissionTypeId: [] },
        {
            id: "fms-settings", label: "Settings", icon: "ri-settings-2-fill", link: "/fms/settings", parentId: "fms",
            permissionTypeId: [],
        },
    ];
}