import axiosClient, { withRetry } from "./axiosClient";

const ANALYSIS_TIMEOUT_MS = 120000;

export const reportsApi = {
  getQuickResult: async () => {
    const response = await withRetry(
      () =>
        axiosClient.get("/api/Reports/quick-result", {
          timeout: ANALYSIS_TIMEOUT_MS,
        }),
      { retries: 2, delayMs: 2500 }
    );
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await withRetry(() =>
      axiosClient.get("/api/Reports/dashboard")
    );
    return response.data;
  },
};

export default reportsApi;
