import React, { useEffect, useMemo, useState } from "react";

import styles from "./Experience.module.css";
import { getImageUrl } from "../../utils";

const Modal = ({ item, organization, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.modalHeader}>
          <img
            src={getImageUrl(item.imageSrc)}
            alt={`${organization} Logo`}
            className={styles.modalLogo}
          />
          <div>
            <p className={styles.modalOrg}>{organization}</p>
            <h3 className={styles.modalRole}>{item.role}</h3>
            <span className={styles.modalDate}>
              {item.startDate} — {item.endDate}
            </span>
          </div>
        </div>

        {(item.experiences || []).length > 0 && (
          <>
            <div className={styles.modalDivider} />
            <ul className={styles.modalBullets}>
              {(item.experiences || []).map((exp, i) => (
                <li key={i} className={styles.modalBullet}>{exp}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

const MONTH_INDEX = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const ONGOING_TOKENS = ["present", "current", "ongoing", "now", "today"];

const getDateSortValue = (value, { isEndDate = false } = {}) => {
  if (typeof value !== "string") {
    return Number.NEGATIVE_INFINITY;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return Number.NEGATIVE_INFINITY;
  }

  if (ONGOING_TOKENS.some((token) => normalized.includes(token))) {
    return Number.POSITIVE_INFINITY;
  }

  const cleaned = normalized.replace(/[^a-z0-9\s]/g, " ");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const yearToken = parts.find((part) => /^\d{4}$/.test(part));
  const year = yearToken ? Number(yearToken) : Number.NaN;

  if (!Number.isFinite(year)) {
    return Number.NEGATIVE_INFINITY;
  }

  const monthPart = parts.find((part) => MONTH_INDEX[part] !== undefined);
  const month = monthPart
    ? MONTH_INDEX[monthPart]
    : isEndDate
      ? 11
      : 0;

  return year * 12 + month;
};

export const Experience = ({ skills = [], history = [] }) => {
  const [selected, setSelected] = useState(null);
  const sortedHistory = useMemo(
    () =>
      [...history].sort((left, right) => {
        const rightEnd = getDateSortValue(right.endDate, { isEndDate: true });
        const leftEnd = getDateSortValue(left.endDate, { isEndDate: true });

        if (rightEnd !== leftEnd) {
          return rightEnd - leftEnd;
        }

        const rightStart = getDateSortValue(right.startDate);
        const leftStart = getDateSortValue(left.startDate);

        if (rightStart !== leftStart) {
          return rightStart - leftStart;
        }

        return 0;
      }),
    [history],
  );

  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>

        <div className={styles.skillsTrack}>
          <div className={styles.skillsInner}>
            {[...skills, ...skills, ...skills, ...skills].map((skill, id) => (
              <div key={id} className={styles.skill}>
                <div className={styles.skillImageContainer}>
                  <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                </div>
                <p>{skill.title}</p>
              </div>
            ))}
          </div>
        </div>

        <ul className={styles.history}>
          {sortedHistory.map((historyItem, id) => {
            const organization =
              historyItem.organization || historyItem.orginization || "";
            return (
              <li key={id} className={styles.historyItem}>
                <div className={styles.timelineNode}>
                  <div className={styles.dot} />
                  {id < sortedHistory.length - 1 && <div className={styles.line} />}
                </div>
                <button
                  className={styles.historyCard}
                  onClick={() => setSelected({ item: historyItem, organization })}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.orgRow}>
                      <img
                        src={getImageUrl(historyItem.imageSrc)}
                        alt={`${organization} Logo`}
                        className={styles.orgLogo}
                      />
                      <div>
                        <p className={styles.orgName}>{organization}</p>
                        <p className={styles.role}>{historyItem.role}</p>
                      </div>
                    </div>
                    <div className={styles.cardRight}>
                      <span className={styles.date}>
                        {historyItem.startDate} — {historyItem.endDate}
                      </span>
                      <span className={styles.viewHint}>View details →</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

      </div>

      {selected && (
        <Modal
          item={selected.item}
          organization={selected.organization}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
};
