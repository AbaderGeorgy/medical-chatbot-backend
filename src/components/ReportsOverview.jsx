import StatCard, { StatCardSkeleton } from "./StatCard";

export default function ReportsOverview({ metrics, loading, error, onRetry }) {
  if (loading) {
    return (
      <section className="reports-statistics" aria-busy="true" aria-label="Loading reports overview">
        <h2 className="section-title">Reports Overview</h2>
        <div className="stats-grid">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="reports-statistics reports-statistics--error" role="alert">
        <h2 className="section-title">Reports Overview</h2>
        <p className="reports-overview-error">{error}</p>
        {onRetry && (
          <button type="button" className="btn btn--secondary btn--sm" onClick={onRetry}>
            Retry
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="reports-statistics">
      <h2 className="section-title">Reports Overview</h2>
      <div className="stats-grid">
        <StatCard
          icon="📋"
          value={metrics.totalReports}
          label="Total Reports"
        />
        <StatCard
          icon="✅"
          value={metrics.completedReports}
          label="Completed Reports"
        />
        <StatCard
          icon="📊"
          value={metrics.averageConfidence}
          label="Average Confidence Score"
        />
        <StatCard
          icon="🕒"
          value={metrics.lastAnalysis}
          label="Last Analysis"
          isTextValue
        />
      </div>
    </section>
  );
}
