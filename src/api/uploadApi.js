import axiosClient, { withRetry } from "./axiosClient";

const UPLOAD_TIMEOUT_MS = 300000;

const inferFileType = (file) => {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "PDF";
  return "XRay";
};

export const uploadApi = {
  uploadFile: async (file, fileType) => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("FileType", fileType || inferFileType(file));

    const response = await withRetry(
      () =>
        axiosClient.post("/api/MedicalFiles/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: UPLOAD_TIMEOUT_MS,
        }),
      { retries: 1, delayMs: 3000 }
    );
    return response.data;
  },
};

export default uploadApi;
