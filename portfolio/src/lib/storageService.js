import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { storage } from "./firebase";

const getFileExtension = (name = "") => {
  const parts = name.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.pop();
};

const sanitizePathChunk = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const DEFAULT_UPLOAD_TIMEOUT_MS = 45000;

export const uploadPortfolioImage = async ({
  file,
  section,
  onProgress,
  timeoutMs = DEFAULT_UPLOAD_TIMEOUT_MS,
}) => {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not configured. Add VITE_FIREBASE_STORAGE_BUCKET.",
    );
  }

  const timestamp = Date.now();
  const randomPart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}${timestamp}`;

  const extension = getFileExtension(file.name);
  const safeSection = sanitizePathChunk(section) || "portfolio";
  const fileName = extension
    ? `${timestamp}-${randomPart}.${extension}`
    : `${timestamp}-${randomPart}`;
  const fileRef = ref(storage, `portfolio/${safeSection}/${fileName}`);
  const uploadTask = uploadBytesResumable(fileRef, file, {
    contentType: file.type || undefined,
  });

  return new Promise((resolve, reject) => {
    let didTimeout = false;
    const timeoutId = globalThis.setTimeout(() => {
      didTimeout = true;
      uploadTask.cancel();
    }, timeoutMs);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (!onProgress || snapshot.totalBytes <= 0) {
          return;
        }

        const progress = Math.min(
          100,
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        );
        onProgress(progress);
      },
      (error) => {
        globalThis.clearTimeout(timeoutId);

        if (didTimeout) {
          const timeoutError = new Error(
            "Image upload timed out. Check your network and Firebase Storage settings, then try again.",
          );
          timeoutError.code = "storage/upload-timeout";
          reject(timeoutError);
          return;
        }

        reject(error);
      },
      async () => {
        globalThis.clearTimeout(timeoutId);

        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      },
    );
  });
};
