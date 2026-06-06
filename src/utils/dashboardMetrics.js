import { formatRelativeTime } from "./formatRelativeTime";

const toNumber = (value) => {
  if (value == null || Number.isNaN(Number(value))) return null;
  return Number(value);
};

const hasValidAnalysis = (quickResult, activities) =>
  activities.length > 0 || Boolean(quickResult?.prediction);

export const buildDashboardMetrics = ({
  dashboardData,
  reportsStats,
  activities = [],
  quickResult = null,
}) => {
  const historyCount = activities.length;
  const hasAnalysis = hasValidAnalysis(quickResult, activities);
  const minimumCount = hasAnalysis ? Math.max(historyCount, 1) : historyCount;

  const totalFiles = Math.max(
    toNumber(dashboardData?.totalFiles) ?? 0,
    toNumber(reportsStats?.totalFiles) ?? 0,
    minimumCount
  );

  const totalReports = Math.max(
    toNumber(dashboardData?.totalReports) ?? 0,
    (toNumber(reportsStats?.completedReports) ?? 0) +
      (toNumber(reportsStats?.pendingReports) ?? 0),
    minimumCount
  );

  const completedAnalyses = Math.max(
    toNumber(reportsStats?.completedReports) ?? 0,
    toNumber(dashboardData?.totalReports) ?? 0,
    minimumCount
  );

  const lastAnalysisDate =
    dashboardData?.lastAnalyzedFile?.createdAt ||
    activities[0]?.createdAt ||
    null;

  const lastAnalysis = lastAnalysisDate
    ? formatRelativeTime(lastAnalysisDate)
    : hasAnalysis
      ? "Recently"
      : "—";

  const formatMetric = (value) => (value > 0 || hasAnalysis ? value : "—");

  return {
    totalFiles: formatMetric(totalFiles),
    totalReports: formatMetric(totalReports),
    completedAnalyses: formatMetric(completedAnalyses),
    lastAnalysis,
    lastAnalysisDate,
  };
};
