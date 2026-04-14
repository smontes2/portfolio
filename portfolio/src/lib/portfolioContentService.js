import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "./firebase";
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
} from "./portfolioContentModel";

const PORTFOLIO_COLLECTION = "portfolio";
const PORTFOLIO_DOC_ID = "content";

const getPortfolioDocRef = () => doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOC_ID);

export const fetchPortfolioContent = async () => {
  if (!db) {
    return {
      content: defaultPortfolioContent,
      source: "local",
      reason: "missing_firebase_config",
    };
  }

  try {
    const snapshot = await getDoc(getPortfolioDocRef());

    if (!snapshot.exists()) {
      return {
        content: defaultPortfolioContent,
        source: "local",
        reason: "missing_remote_doc",
      };
    }

    return {
      content: normalizePortfolioContent(snapshot.data()),
      source: "remote",
      reason: "ok",
    };
  } catch (error) {
    console.error("Unable to fetch remote portfolio data", error);
    return {
      content: defaultPortfolioContent,
      source: "local",
      reason: "fetch_failed",
    };
  }
};

export const savePortfolioContent = async (content, userId = null) => {
  if (!db) {
    throw new Error("Firebase config is missing. Add env vars before saving.");
  }

  const normalized = normalizePortfolioContent(content);

  await setDoc(
    getPortfolioDocRef(),
    {
      ...normalized,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    },
    { merge: true },
  );

  return normalized;
};
