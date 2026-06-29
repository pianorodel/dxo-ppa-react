import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "axios";
import { isEmpty } from "lodash";

import { convertToFormData } from "@/helpers/data_helper";
import { getCurrentUser } from "@/helpers/session_helper";
import { publicRoutes } from "@/routes/AllRoutes";

function createAbortSignalWithTimeout(timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Ensure the timeout is cleared if the request completes
  controller.signal.addEventListener("abort", () => clearTimeout(timeoutId));
  return controller.signal;
}

let isRefreshing = false;
let refreshQueue = [];

axios.interceptors.request.use(
  async (config) => {
    const publicPaths = publicRoutes.map((route) => route.path);
    if (publicPaths.includes(window.location.pathname)) {
      return config;
    }

    if (config.url?.includes("/authentication/refresh-token")) {
      return config;
    }

    const user = getCurrentUser();

    if (!user?.token || !user?.tokenExpiryDate) {
      return config;
    }

    const isExpired = new Date(user.tokenExpiryDate) <= new Date();

    if (!isExpired) {
      config.headers.Authorization = `Bearer ${user.token}`;
      return config;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const url = process.env.REACT_APP_CORE_API + "/authentication/refresh-token";

        const res = await axios.create().post(
          url,
          {},
          { withCredentials: true },
        );

        const newToken = res.data?.returnData?.token;
        const newExpiry = res.data?.returnData?.tokenExpiryDate;

        if (!res?.data?.success) {
          window.location.href = "/logout";
          return Promise.reject(new Error("Refresh failed"));
        }

        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...user,
            token: newToken,
            tokenExpiryDate: newExpiry,
          }),
        );

        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      } catch {
        window.location.href = "/logout";
        return Promise.reject(new Error("Refresh error"));
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve) => {
      refreshQueue.push((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(config);
      });
    });
  },
  (error) => Promise.reject(error),
);

const axiosBaseQuery =
  ({ baseUrl, timeout = 60000 }) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    async ({ url, method, data, params, headers, ...rest }, api) => {
      try {
        const signal = createAbortSignalWithTimeout(timeout); // Use timeout signal

        // Check if data has files to convert to FormData and make the content type 'multipart/form-data'
        const dataHasFiles = Object.keys(data).some(
          (key) => ["file", "photo"].some((keyword) => key.toLowerCase().includes(keyword)) && !key.toLowerCase().includes("fileid"),
        );

        const shouldUseFormData = typeof data?.formData === "boolean" ? data?.formData : dataHasFiles;
        const { formData, ...resData } = data;

        const finalData = shouldUseFormData ? convertToFormData(resData) : resData;

        const contentType = shouldUseFormData ? "multipart/form-data" : "application/json";
        const tokenLocation = api.getState()?.api?.mutations?.currentUser;
        const token = tokenLocation?.data?.returnData?.token || "";

        const keyToUse = process.env.REACT_APP_XAPI_KEY;
        const result = await axios({
          url,
          baseURL: baseUrl,
          method,
          data: finalData,
          params,
          signal, // Attach signal for cancellation
          withCredentials: true,
          headers: {
            accept: "application/json, text/plain, */*",
            ...(keyToUse && { "x-api-key": keyToUse }),
            ...(!isEmpty(token) && { Authorization: `Bearer ${token}` }),
            "Content-Type": contentType,
            ...headers,
          },
          ...rest,
        });

        return { data: result };
      } catch (axiosError) {
        const err = axiosError;
        let errorData = {
          status: err.response?.status,
          data: err.response?.data || err.message,
        };
        if (err.code === "ECONNABORTED" || err.message === "Aborted") {
          errorData = {
            status: 408,
            data: "The request took too long to complete.",
          };
        }

        return { error: errorData };
      }
    };

const baseApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "",
    timeout: 60000, // Optional: Set a default timeout
  }),
  // extractRehydrationInfo(action, { reducerPath }) {
  //   if (action.type === REHYDRATE && action?.payload) {
  //     if (action?.key === "root") {
  //       return action?.payload[reducerPath];
  //     }
  //     return action?.payload;
  //   }
  // },
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

export { baseApi };

