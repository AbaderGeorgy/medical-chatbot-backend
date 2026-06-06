const EMOJI_REGEX =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{2300}-\u{23FF}\u{2B50}\u{2934}-\u{2935}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

const SECTION_LABEL_RULES = [
  {
    test: /phase\s*1|immediate|emergency|first\s*aid/i,
    label: "Phase 1 - Immediate First Aid",
  },
  {
    test: /phase\s*2|hospital|short.term|management/i,
    label: "Phase 2 - Hospital Care",
  },
  {
    test: /phase\s*3|recovery|re.evaluate/i,
    label: "Phase 3 - Recovery",
  },
  {
    test: /red\s*flag/i,
    label: "Red Flags",
  },
];

export const stripEmojis = (text) => {
  if (text == null) return "";
  return String(text).replace(EMOJI_REGEX, "");
};

export const sanitizeForPdf = (text) => {
  if (text == null) return "";

  return stripEmojis(String(text))
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const normalizeConditionTitle = (text) => {
  const cleaned = sanitizeForPdf(text);
  if (!cleaned) return "Analysis Result";

  const upper = cleaned.toUpperCase();
  if (/FRACTURE/.test(upper) && /NO|NOT/.test(upper)) {
    return "NO FRACTURE DETECTED";
  }
  if (/FRACTURE/.test(upper)) {
    return "FRACTURE DETECTED";
  }

  return cleaned;
};

export const normalizeUrgency = (text) => {
  const cleaned = sanitizeForPdf(text);
  if (!cleaned) return "";

  if (/urgent|emergency|immediate/i.test(cleaned)) {
    return `URGENT: ${cleaned.replace(/^urgent[:\s-]*/i, "")}`;
  }

  return cleaned;
};

export const normalizeSectionLabel = (label) => {
  const cleaned = sanitizeForPdf(label);
  if (!cleaned) return "Recommendations";

  const rule = SECTION_LABEL_RULES.find(
    (entry) => entry.test.test(cleaned) || entry.test.test(label || "")
  );

  return rule?.label || cleaned;
};

export const sanitizeBulletStep = (step) => {
  const cleaned = sanitizeForPdf(step);
  return cleaned.replace(/^[-*•]\s*/, "");
};
