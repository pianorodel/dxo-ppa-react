import SettingsPage from "@/components/Common/SettingsPage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";

const SETTINGS = [
  {
    category: "Fund Management",
    items: [
      {
        title: "Fund Sources",
        description: "Manage fund categories, clusters, authorization codes, and financing sources aligned with UACS and DBM standards.",
        icon: "ri-bank-line", color: "primary", link: "/fms/settings/fundsources",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_FUNDCATEGORIES,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_FUNDCLUSTERS,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_AUTHORIZATIONCODES,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_FINANCINGSOURCES,
        ],
      },
      {
        title: "Object Codes",
        description: "Configure UACS object codes for expenditure classification used in budget execution and financial reporting.",
        icon: "ri-barcode-line", color: "info", link: "/fms/settings/objectCodes",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_OBJECTCODES,
        ],
      },
      {
        title: "Programs / Projects",
        description: "Maintain programs, projects, and activities (PPA) used in allotment and obligation tracking.",
        icon: "ri-projector-line", color: "success", link: "/fms/settings/programs",
        permissionTypeId: [
        ],
      },
      {
        title: "Responsibility Centers",
        description: "Define offices, divisions, and units as responsibility centers for budget monitoring and financial reporting.",
        icon: "ri-building-2-line", color: "secondary", link: "/fms/settings/offices",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_RESPONSIBILITYCENTERS
        ],
      },
    ],
  },
  {
    category: "Accounting & Chart of Accounts",
    items: [
      {
        title: "Chart of Accounts",
        description: "Set up account classifications, general ledger, and subsidiary ledger accounts per COA Circular and eNGAS guidelines.",
        icon: "ri-book-2-line", color: "primary", link: "/fms/settings/chartofaccounts",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_ACCOUNTCLASSIFICATIONS,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_GENERALLEDGERS,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_SUBSIDIARYLEDGERS,
        ],
      },
      {
        title: "Allotment Source Document Types",
        description: "Configure source document types that support allotment releases — GAA, SARO, SAA, and other allotment instruments.",
        icon: "ri-file-list-3-line", color: "warning", link: "/fms/settings/allotmentSourceDocumentTypes",
        permissionTypeId: [],
      },
    ],
  },
  {
    category: "Documents & Transactions",
    items: [
      {
        title: "Accountable Forms",
        description: "Manage official accountable forms — ORs, checks, and other pre-numbered forms used in government financial operations.",
        icon: "ri-newspaper-line", color: "warning", link: "/fms/settings/accountableForms",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_ACCOUNTABLEFORMS
        ],
      },
      {
        title: "Document Types",
        description: "Source document types that provide evidence and justification for financial transactions per COA auditing standards.",
        icon: "ri-file-text-line", color: "info", link: "/fms/settings/documentTypes",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_DOCUMENTTYPES
        ],
      },
      {
        title: "Transaction Types",
        description: "Different kinds of transactions used in revenue, fee, and tax collection — mapped to appropriate accounting entries.",
        icon: "ri-swap-box-line", color: "primary", link: "/fms/settings/transactionTypes",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_TRANSACTIONTYPES
        ],
      },
    ],
  },
  {
    category: "Banking & Clients",
    items: [
      {
        title: "Bank Details",
        description: "Configure banks, bank branches, and bank accounts used in disbursement, payroll, and revenue remittance transactions.",
        icon: "ri-secure-payment-line", color: "success", link: "/fms/settings/bankdetails",
        permissionTypeId: [
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKACCOUNTS,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKS,
          FMS_ACCESS_RIGHTS.FMS_STATICDATA_BANKBRANCHES,
        ],
      },
      {
        title: "Clients",
        description: "Government agencies or entities that collect revenues, fees, or taxes for the state — used in collection and remittance records.",
        icon: "ri-government-line", color: "info", link: "/fms/settings/clients",
        permissionTypeId: [FMS_ACCESS_RIGHTS.FMS_STATICDATA_CLIENTS],
      },
    ],
  },
];

const DesktopView = () => {

  return (
    <SettingsPage
      title="FMS Settings"
      breadCrumbs={[
        { title: "FMS", url: "/fms/dashboard" },
      ]}
      settings={SETTINGS} />
  );
};

export default DesktopView; 