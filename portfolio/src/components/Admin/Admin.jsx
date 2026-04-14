import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import styles from "./Admin.module.css";
import {
  auth,
  hasFirebaseConfig,
  hasFirebaseStorageConfig,
} from "../../lib/firebase";
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
} from "../../lib/portfolioContentModel";
import {
  fetchPortfolioContent,
  savePortfolioContent,
} from "../../lib/portfolioContentService";
import { uploadPortfolioImage } from "../../lib/storageService";

const parseCommaSeparatedList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const getReadableError = (error) => {
  const code = error?.code || "";

  if (code === "permission-denied" || code === "firestore/permission-denied") {
    return "Missing permissions in Firestore rules. Publish rules that allow authenticated writes to /portfolio/content, then try again.";
  }

  if (code === "unauthenticated" || code === "firestore/unauthenticated") {
    return "Your session is not authenticated for Firestore. Sign out and sign back in.";
  }

  if (code === "storage/unauthorized") {
    return "Missing permissions in Firebase Storage rules. Publish rules that allow authenticated uploads, then try again.";
  }

  if (code === "storage/unauthenticated") {
    return "Your session is not authenticated for Firebase Storage. Sign out and sign back in.";
  }

  return error?.message || "An unexpected error occurred.";
};

const EMPTY_SKILL = {
  title: "",
  imageSrc: "",
};

const EMPTY_PROJECT = {
  title: "",
  imageSrc: "",
  description: "",
  skills: [],
  demo: "",
  source: "",
};

const EMPTY_EXPERIENCE = {
  role: "",
  organization: "",
  startDate: "",
  endDate: "",
  experiences: [],
  imageSrc: "",
};

export const Admin = () => {
  const [content, setContent] = useState(defaultPortfolioContent);
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImageKeys, setUploadingImageKeys] = useState({});
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(hasFirebaseConfig);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const result = await fetchPortfolioContent();

      if (!isMounted) {
        return;
      }

      setContent(normalizePortfolioContent(result.content));
      setIsContentLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isLoading = isContentLoading || isAuthLoading;
  const isUploadingAnyImage = Object.values(uploadingImageKeys).some(Boolean);

  const completedSections = useMemo(
    () => ({
      languages: content.skills.length,
      projects: content.projects.length,
      experiences: content.history.length,
    }),
    [content],
  );

  const updateArrayItem = (key, index, updatedItem) => {
    setContent((previous) => ({
      ...previous,
      [key]: previous[key].map((item, itemIndex) =>
        itemIndex === index ? updatedItem : item,
      ),
    }));
  };

  const addArrayItem = (key, item) => {
    setContent((previous) => ({
      ...previous,
      [key]: [...previous[key], item],
    }));
  };

  const removeArrayItem = (key, index) => {
    setContent((previous) => ({
      ...previous,
      [key]: previous[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleCredentialChange = (event) => {
    const { name, value } = event.target;
    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!auth) {
      setErrorMessage("Firebase auth is not configured.");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.email.trim(),
        credentials.password,
      );
      setCredentials({ email: "", password: "" });
      setStatusMessage("Signed in. You can now edit and save content.");
    } catch (error) {
      setErrorMessage(getReadableError(error));
    }
  };

  const handleSignOut = async () => {
    setErrorMessage("");
    setStatusMessage("");

    if (!auth) {
      return;
    }

    try {
      await signOut(auth);
      setStatusMessage("Signed out.");
    } catch (error) {
      setErrorMessage(getReadableError(error));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const normalized = await savePortfolioContent(content, user?.uid ?? null);
      setContent(normalized);
      setStatusMessage("Changes saved to Firebase.");
    } catch (error) {
      setErrorMessage(getReadableError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const setImageUploadState = (key, value) => {
    setUploadingImageKeys((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleImageUpload = async ({ file, section, uploadKey, onUploaded }) => {
    if (!hasFirebaseStorageConfig) {
      setErrorMessage(
        "Firebase Storage is not configured. Add VITE_FIREBASE_STORAGE_BUCKET to .env.",
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Only image files are supported.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setImageUploadState(uploadKey, true);

    try {
      const url = await uploadPortfolioImage({ file, section });
      onUploaded(url);
      setStatusMessage("Image uploaded. Save changes to publish.");
    } catch (error) {
      setErrorMessage(getReadableError(error));
    } finally {
      setImageUploadState(uploadKey, false);
    }
  };

  if (!hasFirebaseConfig) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Portfolio Admin</h1>
          <p className={styles.bodyText}>
            Firebase is not configured yet. Add the required environment
            variables in <code>.env</code> before using this editor.
          </p>
          <ul className={styles.list}>
            <li><code>VITE_FIREBASE_API_KEY</code></li>
            <li><code>VITE_FIREBASE_AUTH_DOMAIN</code></li>
            <li><code>VITE_FIREBASE_PROJECT_ID</code></li>
            <li><code>VITE_FIREBASE_STORAGE_BUCKET</code></li>
            <li><code>VITE_FIREBASE_MESSAGING_SENDER_ID</code></li>
            <li><code>VITE_FIREBASE_APP_ID</code></li>
          </ul>
          <a className={styles.linkButton} href="/">
            Return to site
          </a>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Portfolio Admin</h1>
          <p className={styles.bodyText}>Loading content...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Portfolio Admin</h1>
          <p className={styles.bodyText}>
            Sign in with your Firebase Auth account to edit site content.
          </p>
          <form className={styles.authForm} onSubmit={handleSignIn}>
            <label className={styles.fieldGroup}>
              Email
              <input
                className={styles.input}
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleCredentialChange}
                required
              />
            </label>
            <label className={styles.fieldGroup}>
              Password
              <input
                className={styles.input}
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                required
              />
            </label>
            <button type="submit" className={styles.primaryButton}>
              Sign in
            </button>
          </form>
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
          {statusMessage && <p className={styles.successText}>{statusMessage}</p>}
          <a className={styles.linkButton} href="/">
            Return to site
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.heading}>Portfolio Admin</h1>
            <p className={styles.bodyText}>
              Signed in as {user.email}. Update your languages, experiences,
              and projects, then save.
            </p>
            <p className={styles.mutedText}>
              Languages: {completedSections.languages} | Experiences: {completedSections.experiences} | Projects: {completedSections.projects}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSave}
              disabled={isSaving || isUploadingAnyImage}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleSignOut}
            >
              Sign out
            </button>
            <a className={styles.linkButton} href="/">
              View site
            </a>
          </div>
        </header>

        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        {statusMessage && <p className={styles.successText}>{statusMessage}</p>}
        {!hasFirebaseStorageConfig && (
          <p className={styles.warningText}>
            Image uploads are disabled until <code>VITE_FIREBASE_STORAGE_BUCKET</code> is set.
          </p>
        )}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Languages</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => addArrayItem("skills", EMPTY_SKILL)}
            >
              Add language
            </button>
          </div>

          <div className={styles.grid}>
            {content.skills.map((skill, index) => (
              <article className={styles.card} key={`skill-${index}`}>
                <label className={styles.fieldGroup}>
                  Name
                  <input
                    className={styles.input}
                    value={skill.title}
                    onChange={(event) =>
                      updateArrayItem("skills", index, {
                        ...skill,
                        title: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Image path or URL
                  <input
                    className={styles.input}
                    value={skill.imageSrc}
                    placeholder="skills/react.png or https://..."
                    onChange={(event) =>
                      updateArrayItem("skills", index, {
                        ...skill,
                        imageSrc: event.target.value,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeArrayItem("skills", index)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Experiences</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => addArrayItem("history", EMPTY_EXPERIENCE)}
            >
              Add experience
            </button>
          </div>

          <div className={styles.grid}>
            {content.history.map((item, index) => (
              <article className={styles.card} key={`experience-${index}`}>
                <label className={styles.fieldGroup}>
                  Role
                  <input
                    className={styles.input}
                    value={item.role}
                    onChange={(event) =>
                      updateArrayItem("history", index, {
                        ...item,
                        role: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Organization
                  <input
                    className={styles.input}
                    value={item.organization}
                    onChange={(event) =>
                      updateArrayItem("history", index, {
                        ...item,
                        organization: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Start date
                  <input
                    className={styles.input}
                    value={item.startDate}
                    onChange={(event) =>
                      updateArrayItem("history", index, {
                        ...item,
                        startDate: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  End date
                  <input
                    className={styles.input}
                    value={item.endDate}
                    onChange={(event) =>
                      updateArrayItem("history", index, {
                        ...item,
                        endDate: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Logo path or URL
                  <input
                    className={styles.input}
                    value={item.imageSrc}
                    placeholder="history/company.png or https://..."
                    onChange={(event) =>
                      updateArrayItem("history", index, {
                        ...item,
                        imageSrc: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Upload logo image
                  <input
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      void handleImageUpload({
                        file,
                        section: "history",
                        uploadKey: `history-${index}`,
                        onUploaded: (imageUrl) =>
                          updateArrayItem("history", index, {
                            ...item,
                            imageSrc: imageUrl,
                          }),
                      });

                      event.target.value = "";
                    }}
                  />
                </label>
                {uploadingImageKeys[`history-${index}`] && (
                  <p className={styles.helperText}>Uploading image...</p>
                )}
                <label className={styles.fieldGroup}>
                  Bullet points (one per line)
                  <textarea
                    className={styles.textarea}
                    rows="5"
                    value={item.experiences.join("\n")}
                    onChange={(event) =>
                      updateArrayItem("history", index, {
                        ...item,
                        experiences: parseLines(event.target.value),
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeArrayItem("history", index)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Projects</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => addArrayItem("projects", EMPTY_PROJECT)}
            >
              Add project
            </button>
          </div>

          <div className={styles.grid}>
            {content.projects.map((project, index) => (
              <article className={styles.card} key={`project-${index}`}>
                <label className={styles.fieldGroup}>
                  Title
                  <input
                    className={styles.input}
                    value={project.title}
                    onChange={(event) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        title: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Image path or URL
                  <input
                    className={styles.input}
                    value={project.imageSrc}
                    placeholder="projects/my-project.png or https://..."
                    onChange={(event) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        imageSrc: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Upload project image
                  <input
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      void handleImageUpload({
                        file,
                        section: "projects",
                        uploadKey: `projects-${index}`,
                        onUploaded: (imageUrl) =>
                          updateArrayItem("projects", index, {
                            ...project,
                            imageSrc: imageUrl,
                          }),
                      });

                      event.target.value = "";
                    }}
                  />
                </label>
                {uploadingImageKeys[`projects-${index}`] && (
                  <p className={styles.helperText}>Uploading image...</p>
                )}
                <label className={styles.fieldGroup}>
                  Description
                  <textarea
                    className={styles.textarea}
                    rows="5"
                    value={project.description}
                    onChange={(event) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        description: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Skills (comma separated)
                  <input
                    className={styles.input}
                    value={project.skills.join(", ")}
                    onChange={(event) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        skills: parseCommaSeparatedList(event.target.value),
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Demo URL
                  <input
                    className={styles.input}
                    value={project.demo}
                    onChange={(event) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        demo: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.fieldGroup}>
                  Source URL
                  <input
                    className={styles.input}
                    value={project.source}
                    onChange={(event) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        source: event.target.value,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeArrayItem("projects", index)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
