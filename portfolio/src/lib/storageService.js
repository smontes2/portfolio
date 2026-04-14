import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

export const uploadPortfolioImage = async ({ file, section }) => {
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

  await uploadBytes(fileRef, file, {
    contentType: file.type || undefined,
  });

  return getDownloadURL(fileRef);
};
