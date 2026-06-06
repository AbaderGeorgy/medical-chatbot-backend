import { getStoredUser } from "../utils/authUtils";
import {
  flattenRecommendations,
  normalizePrediction,
} from "../utils/reportHelpers";

export const HISTORY_UPDATED_EVENT = "analysis-history-updated";
const MAX_HISTORY_ITEMS = 100;

const getStorageKey = (userId) => `skeletix_analysis_history_${userId}`;

export const getCurrentUserId = () => {
  const user = getStoredUser();
  return user?.id ? String(user.id) : null;
};

export const buildAnalysisRecord = ({
  uploadData,
  quickResult,
  patientName,
  userId,
}) => {
  const createdAt = uploadData?.createdAt || new Date().toISOString();
  const fileId = uploadData?.fileId;
  const id = fileId
    ? `file-${fileId}`
    : `quick-${String(quickResult?.prediction || "result").replace(/\s+/g, "-")}`;

  return {
    id,
    userId: String(userId),
    createdAt,
    fileName: uploadData?.fileName || "Medical Analysis",
    fileType: uploadData?.fileType || "XRay",
    fileId: fileId ?? null,
    fileFormat: uploadData?.fileFormat || null,
    uploadData: uploadData || null,
    quickResult: quickResult || null,
    prediction: quickResult?.prediction || null,
    diseaseName:
      quickResult?.recommendation?.title ||
      normalizePrediction(quickResult?.prediction) ||
      "Analysis Result",
    detections: quickResult?.detections ?? null,
    confidence: quickResult?.confidence ?? null,
    analysisSummary: normalizePrediction(quickResult?.prediction),
    recommendations: flattenRecommendations(quickResult?.recommendation),
    urgency: quickResult?.recommendation?.urgency || null,
    imageUrl: quickResult?.image_url || null,
    patientName: patientName || "Patient",
    savedAt: new Date().toISOString(),
  };
};

export const getAnalysisHistory = (userId = getCurrentUserId()) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];
    return items.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch {
    return [];
  }
};

export const saveAnalysisToHistory = (record) => {
  const userId = record?.userId || getCurrentUserId();
  if (!userId || !record) return false;

  const key = getStorageKey(userId);
  const history = getAnalysisHistory(userId);
  const exists = history.some((item) => item.id === record.id);
  if (exists) return false;

  const updated = [record, ...history]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent(HISTORY_UPDATED_EVENT, { detail: record })
  );
  return true;
};

export const syncQuickResultToHistory = ({
  quickResult,
  uploadData,
  patientName,
  userId,
}) => {
  if (!quickResult?.prediction || !userId) return false;

  const record = buildAnalysisRecord({
    uploadData,
    quickResult,
    patientName,
    userId,
  });

  return saveAnalysisToHistory(record);
};

export const getAnalysisById = (id, userId = getCurrentUserId()) =>
  getAnalysisHistory(userId).find((item) => item.id === id) || null;

export const subscribeToHistoryUpdates = (callback) => {
  const handler = () => callback();
  window.addEventListener(HISTORY_UPDATED_EVENT, handler);
  return () => window.removeEventListener(HISTORY_UPDATED_EVENT, handler);
};
