import rawHistory from "../data/history.json";
import rawProjects from "../data/projects.json";
import rawSkills from "../data/skills.json";

const toString = (value) => (typeof value === "string" ? value : "");

const toStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => toString(item).trim())
    .filter(Boolean);
};

export const normalizeSkill = (skill = {}) => ({
  title: toString(skill.title),
  imageSrc: toString(skill.imageSrc),
});

export const normalizeProject = (project = {}) => ({
  title: toString(project.title),
  imageSrc: toString(project.imageSrc),
  description: toString(project.description),
  skills: toStringArray(project.skills),
  demo: toString(project.demo),
  source: toString(project.source),
});

export const normalizeExperience = (experience = {}) => ({
  role: toString(experience.role),
  organization: toString(experience.organization || experience.orginization),
  startDate: toString(experience.startDate),
  endDate: toString(experience.endDate),
  experiences: toStringArray(experience.experiences),
  imageSrc: toString(experience.imageSrc),
});

export const normalizePortfolioContent = (content = {}) => ({
  skills: Array.isArray(content.skills)
    ? content.skills.map(normalizeSkill)
    : [],
  projects: Array.isArray(content.projects)
    ? content.projects.map(normalizeProject)
    : [],
  history: Array.isArray(content.history)
    ? content.history.map(normalizeExperience)
    : [],
});

export const defaultPortfolioContent = normalizePortfolioContent({
  skills: rawSkills,
  projects: rawProjects,
  history: rawHistory,
});
