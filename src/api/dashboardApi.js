import axiosClient, { withRetry } from "./axiosClient";

const fetchQuickResult = async () => {
  try {
    const response = await withRetry(
      () => axiosClient.get("/api/Reports/quick-result"),
      { retries: 1, delayMs: 1500 }
    );
    return response.data?.data ?? null;
  } catch {
    return null;
  }
};

export const dashboardApi = {
  getDashboard: async () => {
    const response = await withRetry(() =>
      axiosClient.get("/api/Dashboard")
    );
    return response.data;
  },

  getReportsDashboardStats: async () => {
    const response = await withRetry(() =>
      axiosClient.get("/api/Reports/dashboard")
    );
    return response.data;
  },

  getDashboardMetrics: async () => {
    const [dashboardResponse, reportsResponse, quickResult] = await Promise.all([
      withRetry(() => axiosClient.get("/api/Dashboard")),
      withRetry(() => axiosClient.get("/api/Reports/dashboard")),
      fetchQuickResult(),
    ]);

    return {
      dashboard: dashboardResponse.data?.data ?? null,
      reportsStats: reportsResponse.data?.data ?? null,
      quickResult,
    };
  },
};

export default dashboardApi;
