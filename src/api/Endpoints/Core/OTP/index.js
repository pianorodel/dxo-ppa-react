import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";

import getBuilders from "@/api/Utils/GetBuilders";

const baseURL = process.env.REACT_APP_CORE_API + "/otp";

export const otpAPI = createDynamicResourceAPI({
  resource: "OTP",
  tagTypes: ["OTP"],
  endpoints: (builder, resource) => {
    const { query, mutation } = getBuilders(builder);

    return {
      [`setup${resource}`]: builder.mutation({
        query: (payload) => ({
          url: `${baseURL}/setup`,
          method: "POST",
          body: payload.payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${payload.token}`,
          },
        }),
      }),
      [`validate${resource}`]: builder.mutation({
        query: (payload) => ({
          url: `${baseURL}/validate-otp`,
          method: "POST",
          body: payload.payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${payload.token}`,
          },
        }),
      }),
    };
  },
});

export const { useSetupOTPMutation, useValidateOTPMutation } = otpAPI;
