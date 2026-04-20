import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

const isExternalLink = (url = "") => /^https?:\/\//i.test(url);

export const Contact = ({ contact = {} }) => {
  const { title, message, methods = [] } = contact;

  return (
    <footer className={styles.container} id="contact">
      <div className={styles.inner}>
        <div className={styles.glow} />

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.methods}>
          {methods.map((method, index) => {
            const external = isExternalLink(method.href);
            return (
              <a
                key={index}
                href={method.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={styles.method}
              >
                <span className={styles.methodIcon}>
                  <img
                    src={getImageUrl(method.imageSrc)}
                    alt={method.imageAlt}
                  />
                </span>
                <span className={styles.methodLabel}>{method.label}</span>
                <span className={styles.arrow}>↗</span>
              </a>
            );
          })}
        </div>
        <p className={styles.footnote}>
          Built with React · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};
