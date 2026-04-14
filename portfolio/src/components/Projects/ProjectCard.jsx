import React from "react";

import { getImageUrl } from "../../utils";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({
  project: { title, imageSrc, description, skills, demo, source },
}) => {
  const hasDemo = Boolean(demo);
  const hasSource = Boolean(source);

  return (
    <div className={styles.container}>
      <img src={getImageUrl(imageSrc)} alt={`Image of ${title}`} className={styles.image}/>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.skills}>
        {(skills || []).map((skill, id) => {
          return <li className={styles.skill} key={id}>{skill}</li>;
        })}
      </ul>
      {(hasDemo || hasSource) && (
        <div className={styles.links}>
          {hasDemo && (
            <a className={styles.link} target="_blank" rel="noreferrer" href={demo}>
              Demo
            </a>
          )}
          {hasSource && (
            <a className={styles.link} target="_blank" rel="noreferrer" href={source}>
              Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};
