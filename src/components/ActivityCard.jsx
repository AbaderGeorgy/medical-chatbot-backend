import { formatConfidence, formatDate, normalizePrediction } from "../utils/reportHelpers";
import { downloadAnalysisPdf } from "../utils/generateAnalysisPdf";

export default function ActivityCard({ activity }) {
  const handleDownload = () => {
    downloadAnalysisPdf(activity);
  };

  const icon = activity.fileType === "PDF" ? "📄" : "🦴";

  return (
    <article className="activity-card activity-card--history">
      <div className="activity-icon">{icon}</div>
      <div className="activity-content activity-content--expanded">
        <h3>{activity.fileName}</h3>
        <p className="activity-meta">
          <strong>Uploaded:</strong> {formatDate(activity.createdAt)}
        </p>
        <p className="activity-meta">
          <strong>Analysis:</strong> {normalizePrediction(activity.prediction)}
        </p>
        <p className="activity-meta">
          <strong>Condition:</strong> {activity.diseaseName || "—"}
        </p>
        <p className="activity-meta">
          <strong>Confidence:</strong> {formatConfidence(activity.confidence)}
        </p>
      </div>
      <div className="activity-card__actions">
        <span className="status status--success">Complete</span>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleDownload}
        >
          Download PDF
        </button>
      </div>
    </article>
  );
}
