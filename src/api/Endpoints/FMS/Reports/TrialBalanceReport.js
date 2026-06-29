import { baseApi } from "@/api";

export const trialBalanceReportAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateTrialBalanceReportPdf: builder.mutation({
      query: (params) => ({
        url: `${process.env.REACT_APP_FMS_API}/reports/trialBalanceReport/generatePdf`,
        method: "POST",
        body: params || {},
        headers: { "Content-Type": "application/json" },
      }),
      async onQueryStarted(params) {
        const response = await fetch(
          `${process.env.REACT_APP_FMS_API}/reports/trialBalanceReport/generatePdf`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params || {}),
          }
        );

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `trial-balance-report-${new Date()
          .toISOString()
          .split("T")[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    }),
  }),
});

export const { useGenerateTrialBalanceReportPdfMutation } =
  trialBalanceReportAPI;
