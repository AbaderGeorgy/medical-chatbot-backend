export default function StatCard({ icon, value, label, isTextValue = false }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className={`stat-number${isTextValue ? " stat-number--text" : ""}`}>
        {value ?? "—"}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card stat-card--skeleton" aria-hidden="true">
      <div className="stat-skeleton stat-skeleton--icon" />
      <div className="stat-skeleton stat-skeleton--number" />
      <div className="stat-skeleton stat-skeleton--label" />
    </div>
  );
}
