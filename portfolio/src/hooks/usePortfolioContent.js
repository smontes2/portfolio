import { useEffect, useState } from "react";

import {
  defaultPortfolioContent,
  normalizePortfolioContent,
} from "../lib/portfolioContentModel";
import { fetchPortfolioContent } from "../lib/portfolioContentService";

export const usePortfolioContent = (enabled = true) => {
  const [content, setContent] = useState(defaultPortfolioContent);
  const [source, setSource] = useState("local");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    const loadContent = async () => {
      const result = await fetchPortfolioContent();

      if (!isMounted) {
        return;
      }

      setContent(normalizePortfolioContent(result.content));
      setSource(result.source);
      setLoading(false);
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return {
    content,
    source,
    loading,
  };
};
