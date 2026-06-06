import { jsPDF } from "jspdf";
import { formatConfidence, formatDate, normalizePrediction } from "./reportHelpers";
import {
  normalizeConditionTitle,
  normalizeSectionLabel,
  normalizeUrgency,
  sanitizeBulletStep,
  sanitizeForPdf,
} from "./pdfTextSanitizer";

const COLORS = {
  primary: [37, 99, 235],
  text: [30, 41, 59],
  muted: [100, 116, 139],
  line: [226, 232, 240],
};

const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 5.5) => {
  const safeText = sanitizeForPdf(text);
  if (!safeText) return y;
  const lines = doc.splitTextToSize(safeText, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

const drawSectionHeading = (doc, title, margin, y, maxWidth) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  const nextY = addWrappedText(doc, title, margin, y, maxWidth, 6);
  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.3);
  doc.line(margin, nextY + 1, margin + maxWidth, nextY + 1);
  return nextY + 6;
};

const drawField = (doc, label, value, margin, y, maxWidth) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  y = addWrappedText(doc, `${label}:`, margin, y, maxWidth);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  y = addWrappedText(doc, sanitizeForPdf(value) || "-", margin + 2, y, maxWidth - 2);
  return y + 2;
};

const getRecommendationSections = (record) => {
  if (Array.isArray(record.recommendations) && record.recommendations.length > 0) {
    return record.recommendations.map((section) => ({
      label: normalizeSectionLabel(section.label),
      steps: (section.steps || []).map(sanitizeBulletStep).filter(Boolean),
    }));
  }

  const rec = record.quickResult?.recommendation;
  if (!rec) return [];

  const sections = [
    rec.phase_1_Emergency,
    rec.phase_2_Hospital,
    rec.phase_3_Recovery,
    rec.red_Flags,
  ].filter(Boolean);

  return sections
    .map((section) => ({
      label: normalizeSectionLabel(section.label),
      steps: (Array.isArray(section.steps) ? section.steps : [])
        .map(sanitizeBulletStep)
        .filter(Boolean),
    }))
    .filter((section) => section.steps.length > 0);
};

export const generateAnalysisPdfBlob = (record) => {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const maxWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (needed = 20) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = 18;
    }
  };

  const title = sanitizeForPdf(
    record.analysisTitle || "Skeleti-X Medical Analysis Report"
  );

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Skeleti-X", margin, 9);

  y = 24;
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.text);
  y = addWrappedText(doc, title, margin, y, maxWidth, 7);
  y += 4;

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  y = addWrappedText(
    doc,
    `Generated: ${sanitizeForPdf(formatDate(record.createdAt || new Date().toISOString()))}`,
    margin,
    y,
    maxWidth
  );
  y += 6;

  y = drawSectionHeading(doc, "Patient Information", margin, y, maxWidth);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y = drawField(doc, "Patient Name", record.patientName || "Patient", margin, y, maxWidth);
  y = drawField(
    doc,
    "Upload Date",
    formatDate(record.createdAt),
    margin,
    y,
    maxWidth
  );
  y = drawField(doc, "File Name", record.fileName, margin, y, maxWidth);
  y = drawField(doc, "File Type", record.fileType, margin, y, maxWidth);
  y += 4;

  y = drawSectionHeading(doc, "Analysis Summary", margin, y, maxWidth);
  y = drawField(
    doc,
    "Prediction Result",
    normalizePrediction(record.prediction),
    margin,
    y,
    maxWidth
  );
  y = drawField(
    doc,
    "Condition",
    normalizeConditionTitle(record.diseaseName),
    margin,
    y,
    maxWidth
  );
  y = drawField(
    doc,
    "AI Confidence Score",
    formatConfidence(record.confidence),
    margin,
    y,
    maxWidth
  );

  if (record.detections != null) {
    y = drawField(doc, "Detection Count", String(record.detections), margin, y, maxWidth);
  }

  const urgency = normalizeUrgency(record.urgency || record.quickResult?.recommendation?.urgency);
  if (urgency) {
    y = drawField(doc, "Urgency Level", urgency, margin, y, maxWidth);
  }

  const recommendationSections = getRecommendationSections(record);
  if (recommendationSections.length > 0) {
    y += 4;
    ensureSpace(24);
    y = drawSectionHeading(doc, "Clinical Recommendations", margin, y, maxWidth);

    recommendationSections.forEach((section) => {
      ensureSpace(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      y = addWrappedText(doc, section.label, margin, y, maxWidth);
      y += 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.muted);

      section.steps.forEach((step) => {
        ensureSpace(10);
        y = addWrappedText(doc, `- ${step}`, margin + 3, y, maxWidth - 3);
      });
      y += 4;
    });
  }

  y += 4;
  ensureSpace(20);
  y = drawSectionHeading(doc, "AI Notes", margin, y, maxWidth);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  y = addWrappedText(
    doc,
    "This report was generated by Skeleti-X AI analysis. Results are informational only and do not replace professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment decisions.",
    margin,
    y,
    maxWidth,
    4.5
  );

  const safeName = sanitizeForPdf(record.fileName || "report")
    .replace(/[^\w.-]+/g, "_")
    .replace(/\.[^/.]+$/, "");
  const fileName = `Skeletix_${safeName || "report"}_${new Date(
    record.createdAt || Date.now()
  )
    .toISOString()
    .slice(0, 10)}.pdf`;

  return { blob: doc.output("blob"), fileName };
};

export const downloadAnalysisPdf = (record) => {
  const { blob, fileName } = generateAnalysisPdfBlob(record);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
