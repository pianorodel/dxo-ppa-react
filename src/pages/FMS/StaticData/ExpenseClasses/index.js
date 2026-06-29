import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getExpenseClassesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import { useDeleteExpenseClassesMutation, useExportExpenseClassesMutation, useGetExpenseClassesQuery } from "@/api/Endpoints/FMS/StaticData/ExpenseClasses";

const ExpenseClasses = () => {
    return (
        <StaticResourcePage
            title="Expense Classes"
            moduleName="Expense Class"
            useGetQuery={useGetExpenseClassesQuery}
            useDeleteMutation={useDeleteExpenseClassesMutation}
            useExportMutation={useExportExpenseClassesMutation}
            getColumns={getExpenseClassesColumns}
            columnKey="expenseClassId"
            codeField="expenseClassName"
            breadCrumbs={[
                { title: "FMS", url: "/fms/dashboard" },
                { title: "Settings", url: "/fms/settings/" },
            ]}
            SaveModalComponent={SaveModal}
            accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_EXPENSECLASSES}
            logType={FMS_LOG_TYPES.FMS_STATICDATA_EXPENSECLASSES}
        />
    );
}

export default ExpenseClasses;
