import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";
import getBuilders from "@/api/Utils/GetBuilders";

export const paymentTermCyclesAPI = createDynamicResourceAPI({
    resource: "PaymentTermCycles",
    tagTypes: ["paymentTermCycles"],
    endpoints: (builder, resource) => {
        const { query, mutation } = getBuilders(builder);

        return {
            [`lookUp${resource}`]: mutation(`${process.env.REACT_APP_FMS_API}/collection/enums/paymentTermCycles/lookup`, {
                transformResponse: (res) =>
                    (res?.returnData || []).map(({ paymentTermCycleId, paymentTermCycleName }) => ({
                        value: paymentTermCycleId,
                        label: paymentTermCycleName,
                    })),
            }),
        }
    },
});

export const { useLookUpPaymentTermCyclesMutation } = paymentTermCyclesAPI;
