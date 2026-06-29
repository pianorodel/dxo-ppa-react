import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getPaymentModesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeletePaymentModesMutation, useExportPaymentModesMutation, useGetPaymentModesQuery } from "@/api/Endpoints/FMS/StaticData/PaymentModes";

const PaymentModes = () => {
    return (
        <StaticResourcePage
            title="Payment Modes"
            moduleName="Payment Mode"
            useGetQuery={useGetPaymentModesQuery}
            useDeleteMutation={useDeletePaymentModesMutation}
            useExportMutation={useExportPaymentModesMutation}
            getColumns={getPaymentModesColumns}
            columnKey="paymentModeId"
            codeField="paymentModeName"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
                { title: "Settings", url: "/fms/settings" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_PAYMENTMODES}
            logType={FMS_LOG_TYPES.FMS_STATICDATA_PAYMENTMODES}
        />
    );
}

export default PaymentModes;
