export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateString;
  }
};

export const formatConfidence = (confidence) => {
  if (confidence == null || Number.isNaN(confidence)) return "—";
  const value = confidence <= 1 ? confidence * 100 : confidence;
  return `${Math.round(value)}%`;
};

export const normalizePrediction = (prediction) => {
  if (!prediction) return "Pending Analysis";
  return prediction
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const flattenRecommendations = (recommendation) => {
  if (!recommendation) return [];

  const sections = [
    recommendation.phase_1_Emergency,
    recommendation.phase_2_Hospital,
    recommendation.phase_3_Recovery,
    recommendation.red_Flags,
  ].filter(Boolean);

  return sections.flatMap((section) => {
    const label = section.label || "";
    const steps = Array.isArray(section.steps) ? section.steps : [];
    return steps.length ? [{ label, steps }] : [];
  });
};

export const getReportTitle = (uploadData, quickData) => {
  const fileName = uploadData?.fileName;
  const fileType = uploadData?.fileType;
  if (fileName) return `${fileType || "Medical"} Analysis — ${fileName}`;
  if (quickData?.prediction) {
    return `${normalizePrediction(quickData.prediction)} Analysis`;
  }
  return "Latest Analysis Report";
};
