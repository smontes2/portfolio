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

const defaultHeroContent = {
  title: "Hi, I'm Sam",
  description:
    "I'm a Senior Computer Science major at Binghamton University. Reach out if you'd like to learn more!",
  contactText: "Contact Me",
  contactHref: "mailto:smontes2022@gmail.com",
  imageSrc: "hero/heroImage.png",
  imageAlt: "Hero image of me",
};

const defaultContactContent = {
  title: "Contact",
  message: "Feel free to reach out!",
  methods: [
    {
      label: "smontes2022@gmail.com",
      href: "mailto:smontes2022@gmail.com",
      imageSrc: "contact/emailIcon.png",
      imageAlt: "email icon",
    },
    {
      label: "linkedin.com/in/samuel-montes-",
      href: "https://www.linkedin.com/in/samuel-montes-/",
      imageSrc: "contact/linkedinIcon.png",
      imageAlt: "linkedin icon",
    },
    {
      label: "github.com/smontes2",
      href: "https://github.com/smontes2",
      imageSrc: "contact/githubIcon.png",
      imageAlt: "github icon",
    },
  ],
};

export const normalizeContactMethod = (method = {}) => ({
  label: toString(method.label),
  href: toString(method.href),
  imageSrc: toString(method.imageSrc),
  imageAlt: toString(method.imageAlt),
});

export const normalizeHeroContent = (hero = {}) => {
  const mergedHero = {
    ...defaultHeroContent,
    ...(hero || {}),
  };

  return {
    title: toString(mergedHero.title),
    description: toString(mergedHero.description),
    contactText: toString(mergedHero.contactText),
    contactHref: toString(mergedHero.contactHref),
    imageSrc: toString(mergedHero.imageSrc),
    imageAlt: toString(mergedHero.imageAlt),
  };
};

export const normalizeContactContent = (contact = {}) => {
  const mergedContact = {
    ...defaultContactContent,
    ...(contact || {}),
  };

  return {
    title: toString(mergedContact.title),
    message: toString(mergedContact.message),
    methods: Array.isArray(mergedContact.methods)
      ? mergedContact.methods.map(normalizeContactMethod)
      : [],
  };
};

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
  hero: normalizeHeroContent(content.hero),
  contact: normalizeContactContent(content.contact),
});

export const defaultPortfolioContent = normalizePortfolioContent({
  skills: rawSkills,
  projects: rawProjects,
  history: rawHistory,
  hero: defaultHeroContent,
  contact: defaultContactContent,
});
