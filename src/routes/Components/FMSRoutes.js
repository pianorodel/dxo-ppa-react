import { lazy } from "react";

const FMS_Dashboard = lazy(() => import("@/pages/FMS/Dashboard/index"));

const FMS_Settings = lazy(() => import("@/pages/FMS/StaticData"));
const FMS_Settings_AccountableForms = lazy(() => import("@/pages/FMS/StaticData/AccountableForms"));
const FMS_Settings_AllotmentSourceDocumentTypes = lazy(() => import("@/pages/FMS/StaticData/AllotmentSourceDocumentTypes"));
const FMS_Settings_BankDetails = lazy(() => import("@/pages/FMS/StaticData/BankDetails"));
const FMS_Settings_Clients = lazy(() => import("@/pages/FMS/StaticData/Clients"));
const FMS_Settings_DocumentTypes = lazy(() => import("@/pages/FMS/StaticData/DocumentTypes"));
const FMS_Settings_FundSources = lazy(() => import("@/pages/FMS/StaticData/FundSources"));
const FMS_Settings_ChartOfAccounts = lazy(() => import("@/pages/FMS/StaticData/ChartOfAccounts/index"));
const FMS_Settings_ObjectCodes = lazy(() => import("@/pages/FMS/StaticData/ObjectCodes/index"));
const FMS_Settings_Offices = lazy(() => import("@/pages/FMS/StaticData/Offices/index"));
const FMS_Settings_Programs = lazy(() => import("@/pages/FMS/StaticData/Programs/index"));
const FMS_Settings_TransactionTypes = lazy(() => import("@/pages/FMS/StaticData/TransactionTypes/index"));

const FMS_Accounting_TransactionInboxes = lazy(() => import("@/pages/FMS/Accounting/TransactionInboxes/index"));

const FMS_Budget_GAA = lazy(() => import("@/pages/FMS/Budget/GAA/index"));
const FMS_Budget_BUR = lazy(() => import("@/pages/FMS/Budget/BUR/index"));
const FMS_Budget_SARO = lazy(() => import("@/pages/FMS/Budget/SARO/index"));

const FMS_Assets = lazy(() => import("@/pages/FMS/Assets/index"));
const FMS_Assets_DepreciationSchedules = lazy(() => import("@/pages/FMS/Assets/DepreciationSchedules/index"));

const FMS_Transactions_Allotments = lazy(() => import("@/pages/FMS/Transactions/Allotments/index"));
const FMS_Transactions_Appropriations = lazy(() => import("@/pages/FMS/Transactions/Appropriations/index"));
const FMS_Transactions_NoticeOfCashAllocations = lazy(() => import("@/pages/FMS/Transactions/NoticeOfCashAllocations/index"));
const FMS_Transactions_LDDAP = lazy(() => import("@/pages/FMS/Transactions/LDDAPs/index"));
const FMS_Transactions_CashAdvances = lazy(() => import("@/pages/FMS/Transactions/CashAdvances/index"));
const FMS_Transactions_Liquidations = lazy(() => import("@/pages/FMS/Transactions/Liquidations/index"));
const FMS_Transactions_CashDisbursements = lazy(() => import("@/pages/FMS/Transactions/CashDisbursements/index"));
const FMS_Transactions_CheckDisbursements = lazy(() => import("@/pages/FMS/Transactions/CheckDisbursements/index"));
const FMS_Transactions_Collections = lazy(() => import("@/pages/FMS/Transactions/Collections/index"));
const FMS_Transactions_Deposits = lazy(() => import("@/pages/FMS/Transactions/Deposits/index"));
const FMS_Transactions_DisbursementVouchers = lazy(() => import("@/pages/FMS/Transactions/DisbursementVouchers/index"));
const FMS_Transactions_JEV = lazy(() => import("@/pages/FMS/Transactions/JournalEntryVouchers"));
const FMS_Transactions_Obligations = lazy(() => import("@/pages/FMS/Transactions/Obligations/index"));
const FMS_Transactions_OrderOfPayments = lazy(() => import("@/pages/FMS/Transactions/OrderOfPayments/index"));
const FMS_Transactions_Prepayments = lazy(() => import("@/pages/FMS/Transactions/Prepayments/index"));
const FMS_Transactions_Prepayments_Amortizations = lazy(() => import("@/pages/FMS/Transactions/Prepayments/Amortizations/index"));

const FMS_Reports = lazy(() => import("@/pages/FMS/Reports/index"));
const FMS_Reports_Accounting = lazy(() => import("@/pages/FMS/Reports/Accounting/index"));
const FMS_Reports_Budget = lazy(() => import("@/pages/FMS/Reports/Budget/index"));
const FMS_Reports_Collection = lazy(() => import("@/pages/FMS/Reports/Collection/index"));
const FMS_Reports_Disbursement = lazy(() => import("@/pages/FMS/Reports/Disbursement/index"));

export var fmsRoutes = [
    { path: "/fms/dashboard", component: <FMS_Dashboard />, permissionTypeId: [] },

    { path: "/fms/settings", component: <FMS_Settings />, permissionTypeId: [] },
    { path: "/fms/settings/accountableforms", component: <FMS_Settings_AccountableForms />, permissionTypeId: [] },
    { path: "/fms/settings/allotmentSourceDocumentTypes", component: <FMS_Settings_AllotmentSourceDocumentTypes />, permissionTypeId: [] },
    { path: "/fms/settings/bankDetails", component: <FMS_Settings_BankDetails />, permissionTypeId: [] },
    { path: "/fms/settings/clients", component: <FMS_Settings_Clients />, permissionTypeId: [] },
    { path: "/fms/settings/debtors", component: <FMS_Settings_Clients />, permissionTypeId: [] },
    { path: "/fms/settings/documenttypes", component: <FMS_Settings_DocumentTypes />, permissionTypeId: [] },
    { path: "/fms/settings/fundsources", component: <FMS_Settings_FundSources />, permissionTypeId: [] },
    { path: "/fms/settings/chartOfAccounts", component: <FMS_Settings_ChartOfAccounts />, permissionTypeId: [] },
    { path: "/fms/settings/objectCodes", component: <FMS_Settings_ObjectCodes />, permissionTypeId: [] },
    { path: "/fms/settings/offices", component: <FMS_Settings_Offices />, permissionTypeId: [] },
    { path: "/fms/settings/programs", component: <FMS_Settings_Programs />, permissionTypeId: [] },
    { path: "/fms/settings/transactionTypes", component: <FMS_Settings_TransactionTypes />, permissionTypeId: [] },
    { path: "/fms/settings/disbursement-transactionTypes", component: <FMS_Settings_TransactionTypes />, permissionTypeId: [] },

    { path: "/fms/assets", component: <FMS_Assets />, permissionTypeId: [] },
    { path: "/fms/assets/depreciationschedules", component: <FMS_Assets_DepreciationSchedules />, permissionTypeId: [] },
    { path: "/fms/accounting/transactioninboxes", component: <FMS_Accounting_TransactionInboxes />, permissionTypeId: [] },

    { path: "/fms/budget/gaa", component: <FMS_Budget_GAA />, permissionTypeId: [] },
    { path: "/fms/budget/bur", component: <FMS_Budget_BUR />, permissionTypeId: [] },
    { path: "/fms/budget/saro", component: <FMS_Budget_SARO />, permissionTypeId: [] },
    { path: "/fms/budget/appropriations", component: <FMS_Transactions_Appropriations />, permissionTypeId: [] },
    { path: "/fms/budget/nca", component: <FMS_Transactions_NoticeOfCashAllocations />, permissionTypeId: [] },
    { path: "/fms/budget/lddap", component: <FMS_Transactions_LDDAP />, permissionTypeId: [] },
    { path: "/fms/budget/allotments", component: <FMS_Transactions_Allotments />, permissionTypeId: [] },

    { path: "/fms/transactions/cash-advances", component: <FMS_Transactions_CashAdvances />, permissionTypeId: [] },
    { path: "/fms/transactions/liquidations", component: <FMS_Transactions_Liquidations />, permissionTypeId: [] },
    { path: "/fms/transactions/prepayments", component: <FMS_Transactions_Prepayments />, permissionTypeId: [] },
    { path: "/fms/transactions/prepayments/amortizations", component: <FMS_Transactions_Prepayments_Amortizations />, permissionTypeId: [] },
    { path: "/fms/transactions/cashdisbursements", component: <FMS_Transactions_CashDisbursements />, permissionTypeId: [] },
    { path: "/fms/transactions/checkdisbursements", component: <FMS_Transactions_CheckDisbursements />, permissionTypeId: [] },
    { path: "/fms/transactions/collections", component: <FMS_Transactions_Collections />, permissionTypeId: [] },
    { path: "/fms/transactions/deposits", component: <FMS_Transactions_Deposits />, permissionTypeId: [] },
    { path: "/fms/transactions/disbursementvouchers", component: <FMS_Transactions_DisbursementVouchers />, permissionTypeId: [] },
    { path: "/fms/transactions/jev", component: <FMS_Transactions_JEV />, permissionTypeId: [] },
    { path: "/fms/transactions/obligations", component: <FMS_Transactions_Obligations />, permissionTypeId: [] },
    { path: "/fms/transactions/orderofpayments", component: <FMS_Transactions_OrderOfPayments />, permissionTypeId: [] },

    { path: "/fms/reports", component: <FMS_Reports />, permissionTypeId: [] },
    { path: "/fms/reports/accounting", component: <FMS_Reports_Accounting />, permissionTypeId: [] },
    { path: "/fms/reports/budget", component: <FMS_Reports_Budget />, permissionTypeId: [] },
    { path: "/fms/reports/collection", component: <FMS_Reports_Collection />, permissionTypeId: [] },
    { path: "/fms/reports/disbursement", component: <FMS_Reports_Disbursement />, permissionTypeId: [] },
];